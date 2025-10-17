// Genepsyche_Backend/patientApi/routes.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');

// ✅ REST API routes — no duplicate prefix
router.post('/', controller.createPatient);
router.get('/', controller.getAllPatients);
router.get('/:id', controller.getPatientById);
router.put('/:id', controller.updatePatient);
router.delete('/:id', controller.deletePatient);

module.exports = router;
