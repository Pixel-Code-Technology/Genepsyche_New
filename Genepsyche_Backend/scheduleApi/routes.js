// Genepsyche_Backend/scheduleApi/routes.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');

// CRUD Routes
router.post('/schedules', controller.createSchedule);
router.get('/schedules', controller.getAllSchedules);
router.get('/schedules/:id', controller.getScheduleById);
router.put('/schedules/:id', controller.updateSchedule);
router.delete('/schedules/:id', controller.deleteSchedule);

module.exports = router;
