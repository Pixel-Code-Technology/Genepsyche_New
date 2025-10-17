// paymentApi/controller.js
const Payment = require("./model");
const Patient = require("../patientApi/model");
const Service = require("../serviceApi/model");

// 🆕 Create Payment
exports.createPayment = async (req, res) => {
  try {
    const {
      patient_id,
      service_id,
      amount,
      payment_type,
      insurance_coverage,
      description,
    } = req.body;

    if (!patient_id || !amount || !payment_type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const payment_code = `PMT-${Date.now()}`;
    let patient_responsible = amount;

    if (payment_type === "insurance" && insurance_coverage) {
      patient_responsible = amount - insurance_coverage;
    }

    const payment = await Payment.create({
      patient_id,
      service_id,
      payment_code,
      amount,
      payment_type,
      insurance_coverage: insurance_coverage || 0,
      patient_responsible,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Payment record created successfully.",
      data: payment,
    });
  } catch (err) {
    console.error("Error creating payment:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📋 Get All Payments (with Patient + Service)
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        { model: Patient, as: "patient", attributes: ["id", "name", "email"] },
        { model: Service, as: "service", attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, data: payments });
  } catch (err) {
    console.error("Error fetching payments:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔍 Get Single Payment (with relations)
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id, {
      include: [
        { model: Patient, as: "patient", attributes: ["id", "name", "email"] },
        { model: Service, as: "service", attributes: ["id", "name"] },
      ],
    });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }
    res.json({ success: true, data: payment });
  } catch (err) {
    console.error("Error fetching payment:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✏️ Update Payment
exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    await payment.update(updates);
    res.json({
      success: true,
      message: "Payment updated successfully.",
      data: payment,
    });
  } catch (err) {
    console.error("Error updating payment:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🗑️ Delete Payment
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    await payment.destroy();
    res.json({
      success: true,
      message: "Payment deleted successfully.",
    });
  } catch (err) {
    console.error("Error deleting payment:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
