const Patient = require('../patientApi/model');
const Schedule = require('../scheduleApi/model');
const Service = require('../serviceApi/model');
const { Op } = require('sequelize');

// Simple in-memory cache
let cachedStats = null;
let lastCacheTime = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

exports.getStats = async (req, res) => {
  try {
    const now = Date.now();

    // === Caching logic ===
    if (cachedStats && lastCacheTime && now - lastCacheTime < CACHE_TTL) {
      return res.json({ ...cachedStats, cached: true });
    }

    // === Date filters (optional) ===
    const month = parseInt(req.query.month, 10);
    const year = parseInt(req.query.year, 10);

    let dateFilter = {};
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // last day of month
      dateFilter = { startDate: { [Op.between]: [startDate, endDate] } };
    }

    // === Totals ===
    const totalPatients = await Patient.count();
    const totalSchedules = await Schedule.count({ where: dateFilter });
    const totalServices = await Service.count();

    // "Bookings" (active statuses)
    const totalBookings = await Schedule.count({
      where: { ...dateFilter, status: ['Scheduled', 'Initial Session', 'Claim Submission', 'Follow Up'] },
    });

    // "Cancelled"
    const totalCancelled = await Schedule.count({
      where: { ...dateFilter, status: 'Cancel Appointment' },
    });

    // === Popular Services ===
    const popularServicesRaw = await Schedule.findAll({
      attributes: [
        'service',
        [Schedule.sequelize.fn('COUNT', Schedule.sequelize.col('service')), 'count'],
      ],
      where: dateFilter,
      group: ['service'],
      order: [[Schedule.sequelize.literal('count'), 'DESC']],
      limit: 5,
    });

    const popularServices = await Promise.all(
      popularServicesRaw.map(async (item) => {
        const serviceId = item.service;
        const serviceRecord = await Service.findByPk(serviceId);
        return {
          id: serviceId,
          name: serviceRecord ? serviceRecord.name : `Service #${serviceId}`,
          count: item.dataValues.count,
        };
      })
    );

    // === Progress ===
    const progress = {
      bookedPercent: totalSchedules
        ? ((totalBookings / totalSchedules) * 100).toFixed(2)
        : 0,
      cancelledPercent: totalSchedules
        ? ((totalCancelled / totalSchedules) * 100).toFixed(2)
        : 0,
    };

    const stats = {
      totalPatients,
      totalSchedules,
      totalBookings,
      totalServices,
      popularServices,
      progress,
      month: month || 'all',
      year: year || 'all',
    };

    // Save to cache
    cachedStats = stats;
    lastCacheTime = Date.now();

    res.json(stats);
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ message: 'Failed to fetch stats', error });
  }
};
