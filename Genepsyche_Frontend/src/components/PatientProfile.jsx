import React from "react";
import PatientProfile from "./Profile";
import PatientHistory from "./PatientHistory";
import "../../src/styles/PatientProfileModal.css";

const PatientProfileModal = ({ patient, onClose }) => {
  if (!patient) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="modal patient-profile-modal relative bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* ✖ Close Button */}
        <button className="close-btn absolute top-4 right-5" onClick={onClose}>
          ×
        </button>

        {/* ==== PATIENT PROFILE SECTION ==== */}
        <PatientProfile patientId={patient.id} />

        {/* ==== PATIENT HISTORY SECTION ==== */}
        <PatientHistory history={patient.history} />
      </div>
    </div>
  );
};

export default PatientProfileModal;
