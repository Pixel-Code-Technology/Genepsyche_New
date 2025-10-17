const Patient = require('../patientApi/model');
const Schedule = require('../scheduleApi/model');
const Service = require('../serviceApi/model');

exports.getStats = async (req, res) => {
  try {
    // Get totals
    const totalPatients = await Patient.count();
    const totalSchedules = await Schedule.count();
    const totalBookings = await Schedule.count({ where: { status: 'booked' } });
    const totalCancelled = await Schedule.count({ where: { status: 'cancelled' } });
    const totalServices = await Service.count();

    // Popular services
    const popularServicesRaw = await Schedule.findAll({
      attributes: [
        'service',
        [Schedule.sequelize.fn('COUNT', Schedule.sequelize.col('service')), 'count'],
      ],
      group: ['service'],
      order: [[Schedule.sequelize.literal('count'), 'DESC']],
      limit: 5,
    });

    // Map IDs to names
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

    const progress = {
      bookedPercent: totalSchedules ? ((totalBookings / totalSchedules) * 100).toFixed(2) : 0,
      cancelledPercent: totalSchedules ? ((totalCancelled / totalSchedules) * 100).toFixed(2) : 0,
    };

    res.json({
      totalPatients,
      totalSchedules,
      totalBookings,
      totalServices,
      popularServices,
      progress,
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ message: 'Failed to fetch stats', error });
  }
};
