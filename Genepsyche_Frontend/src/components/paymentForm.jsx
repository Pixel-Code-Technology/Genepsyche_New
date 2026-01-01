import React, { useState, useEffect } from "react";

const CreatePaymentForm = ({ onClose, onCreatePayment, isOpen }) => {
  const [formData, setFormData] = useState({
    patient_id: "",
    service_id: "",
    payment_code: "",
    amount: "",
    payment_type: "self-pay",
    insurance_coverage: "",
    patient_responsible: "",
    description: "",
    status: "pending",
    payment_date: new Date().toISOString().split("T")[0],
  });

  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);

  // ✅ Auto-generate payment code
  const generatePaymentCode = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `PAY-${randomNum}`;
  };

  // ✅ Fetch patients and services
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const [patientsRes, servicesRes] = await Promise.all([
          fetch("http://localhost:3000/api/patients"),
          fetch("http://localhost:3000/api/services"),
        ]);

        const patientsData = await patientsRes.json();
        const servicesData = await servicesRes.json();

        if (patientsData.success) setPatients(patientsData.data);
        if (servicesData.success) setServices(servicesData.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
    setFormData((prev) => ({ ...prev, payment_code: generatePaymentCode() }));
  }, [isOpen]);

  // ✅ Auto-calc patient responsibility
  const calcResponsible = () => {
    const { amount, insurance_coverage, payment_type } = formData;
    const amt = parseFloat(amount) || 0;
    const coverage = parseFloat(insurance_coverage) || 0;
    if (payment_type === "insurance") return Math.max(amt - coverage, 0).toFixed(2);
    return amt.toFixed(2);
  };

  // ✅ Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      patient_responsible: calcResponsible(),
    };

    try {
      const res = await fetch("http://localhost:3000/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        onCreatePayment?.(data.data);
        onClose();
      } else {
        alert("Error saving payment: " + data.message);
      }
    } catch (err) {
      console.error("Error saving payment:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Header */}
        
          <h2>Create Payment</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
       

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Patient */}
          <div className="form-group">
            <label>Patient *</label>
            <select
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Service */}
          <div className="form-group">
            <label>Service *</label>
            <select
              name="service_id"
              value={formData.service_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Code */}
          <div className="form-group">
            <label>Payment Code</label>
            <input
              type="text"
              name="payment_code"
              value={formData.payment_code}
              readOnly
            />
          </div>

          {/* Amount & Type */}
          <div className="form-row">
            <div className="form-group">
              <label>Amount ($) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Payment Type *</label>
              <select
                name="payment_type"
                value={formData.payment_type}
                onChange={handleChange}
                required
              >
                <option value="self-pay">Self Pay</option>
                <option value="insurance">Insurance</option>
              </select>
            </div>
          </div>

          {/* Insurance Coverage (conditional) */}
          {formData.payment_type === "insurance" && (
            <div className="form-group">
              <label>Insurance Coverage ($)</label>
              <input
                type="number"
                name="insurance_coverage"
                value={formData.insurance_coverage}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Patient Responsible */}
          <div className="form-group">
            <label>Patient Responsible ($)</label>
            <input type="text" value={calcResponsible()} readOnly />
          </div>

          {/* Payment Date & Status */}
          <div className="form-row">
            <div className="form-group">
              <label>Payment Date *</label>
              <input
                type="date"
                name="payment_date"
                value={formData.payment_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter payment notes"
              rows="3"
            />
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Save Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePaymentForm;
