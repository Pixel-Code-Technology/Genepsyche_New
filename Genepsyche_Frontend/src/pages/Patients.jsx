import React, { useState, useEffect } from "react";
import axios from "axios";
import PatientForm from "../components/PatientForm";
import ShowSelect from "../components/ShowSelect";

const API_URL = "http://localhost:3000/api/patients";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null); // ✅ NEW
  const [showItems, setShowItems] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all patients when component mounts
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(API_URL);
      if (res.data && res.data.data) {
        setPatients(res.data.data);
      } else {
        setError("Unexpected response format from server.");
      }
    } catch (err) {
      console.error("❌ Error fetching patients:", err);
      setError("Failed to load patients. Check server connection or API route.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add or Update Patient
  const handleSavePatient = async (patientData) => {
    try {
      if (editingPatient) {
        // Update existing
        const res = await axios.put(`${API_URL}/${editingPatient.id}`, patientData);
        if (res.data && res.data.data) {
          setPatients((prev) =>
            prev.map((p) => (p.id === editingPatient.id ? res.data.data : p))
          );
        }
      } else {
        // Add new
        const res = await axios.post(API_URL, patientData);
        if (res.data && res.data.data) {
          setPatients([...patients, res.data.data]);
        }
      }
      // Close form
      setShowForm(false);
      setEditingPatient(null);
    } catch (err) {
      console.error("❌ Error saving patient:", err);
      alert("Failed to save patient. Please try again.");
    }
  };

  // ✅ Edit handler
  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  // ✅ Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("❌ Error deleting patient:", err);
      alert("Failed to delete patient.");
    }
  };

  return (
    <div className="patients-page">
      <div className="page-header">
        <ShowSelect value={showItems} onChange={setShowItems} />
        <button
          className="create-btn"
          onClick={() => {
            setEditingPatient(null); // ✅ reset form for new patient
            setShowForm(true);
          }}
        >
          + ADD PATIENT
        </button>
      </div>

      {loading ? (
        <p>Loading patients...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="patients-table">
          <div className="table-header">
            <div>NAME</div>
            <div>EMAIL</div>
            <div>PHONE</div>
            <div>ACTIONS</div>
          </div>

          {patients.length === 0 ? (
            <div className="empty-state">No patients found.</div>
          ) : (
            patients.slice(0, showItems).map((patient) => (
              <div key={patient.id} className="table-row">
                <div>{patient.name}</div>
                <div>{patient.email}</div>
                <div>{patient.phone}</div>
                <div>
                  <button className="action-btn" onClick={() => handleEdit(patient)}>
                    Edit
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(patient.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showForm && (
        <PatientForm
          onClose={() => {
            setShowForm(false);
            setEditingPatient(null);
          }}
          onSave={handleSavePatient} // ✅ renamed to onSave
          patient={editingPatient} // ✅ pass selected patient for edit
        />
      )}
    </div>
  );
};

export default Patients;
