// Genepsyche_Backend/patientApi/controller.js
const Patient = require('./model');

// ✅ Create new patient
exports.createPatient = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const newPatient = await Patient.create({ name, email, phone });

    res.status(201).json({
      success: true,
      message: 'Patient added successfully',
      data: newPatient,
    });
  } catch (error) {
    console.error('❌ Error creating patient:', error);
    res.status(500).json({ success: false, message: 'Failed to add patient', error: error.message });
  }
};

// ✅ Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    console.error('❌ Error fetching patients:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch patients', error: error.message });
  }
};

// ✅ Get single patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    console.error('❌ Error fetching patient:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch patient', error: error.message });
  }
};

// ✅ Update patient
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Patient.update(req.body, { where: { id } });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const updatedPatient = await Patient.findByPk(id);
    res.status(200).json({ success: true, message: 'Patient updated successfully', data: updatedPatient });
  } catch (error) {
    console.error('❌ Error updating patient:', error);
    res.status(500).json({ success: false, message: 'Failed to update patient', error: error.message });
  }
};

// ✅ Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const deleted = await Patient.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.status(200).json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting patient:', error);
    res.status(500).json({ success: false, message: 'Failed to delete patient', error: error.message });
  }
};
