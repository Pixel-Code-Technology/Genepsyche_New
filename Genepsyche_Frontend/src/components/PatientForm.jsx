import React, { useState, useEffect } from "react";

const PatientForm = ({ onClose, onSave, patient }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // ✅ When editing, prefill form
  useEffect(() => {
    if (patient) {
      setName(patient.name || "");
      setEmail(patient.email || "");
      setPhone(patient.phone || "");
    } else {
      setName("");
      setEmail("");
      setPhone("");
    }
  }, [patient]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // onAddPatient({ name, email, phone, id: patient?.id }); 
    onSave({ name, email, phone, id: patient?.id }); // ✅ include id for update if editing
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{patient ? "Edit Patient" : "New Patient"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {patient ? "Update Patient" : "New Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
