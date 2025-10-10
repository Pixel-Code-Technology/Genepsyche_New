// Genepsyche_Backend/patientApi/routes.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');

// ✅ Correct REST API routes
router.post('/patients', controller.createPatient);
router.get('/patients', controller.getAllPatients);
router.get('/patients/:id', controller.getPatientById);
router.put('/patients/:id', controller.updatePatient);
router.delete('/patients/:id', controller.deletePatient);

module.exports = router;
