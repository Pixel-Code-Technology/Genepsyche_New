// Genepsyche_Backend/scheduleApi/controller.js
const Schedule = require('./model');

const { Op } = require('sequelize');

// ✅ Create Schedule (with overlap detection)
exports.createSchedule = async (req, res) => {
  try {
    const { patient, service, startDate, startTime, endTime } = req.body;

    // Check if any schedule overlaps on the same date
    const overlapping = await Schedule.findOne({
      where: {
        startDate,
        [Op.or]: [
          {
            startTime: { [Op.between]: [startTime, endTime] },
          },
          {
            endTime: { [Op.between]: [startTime, endTime] },
          },
          {
            [Op.and]: [
              { startTime: { [Op.lte]: startTime } },
              { endTime: { [Op.gte]: endTime } },
            ],
          },
        ],
      },
    });

    if (overlapping) {
      return res.status(400).json({
        success: false,
        message: 'A schedule already exists during this time period.',
      });
    }

    // ✅ If no conflict, create schedule
    const schedule = await Schedule.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: schedule,
    });
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create schedule',
    });
  }
};


// ✅ Get All Schedules
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.findAll({ order: [['startDate', 'ASC']] });
    res.json({ success: true, data: schedules });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch schedules' });
  }
};

// ✅ Get Schedule by ID
exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule)
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    res.json({ success: true, data: schedule });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch schedule' });
  }
};

// ✅ Update Schedule
exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule)
      return res.status(404).json({ success: false, message: 'Schedule not found' });

    await schedule.update(req.body);
    res.json({ success: true, message: 'Schedule updated successfully', data: schedule });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ success: false, message: 'Failed to update schedule' });
  }
};

// ✅ Delete Schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule)
      return res.status(404).json({ success: false, message: 'Schedule not found' });

    await schedule.destroy();
    res.json({ success: true, message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ success: false, message: 'Failed to delete schedule' });
  }
};
