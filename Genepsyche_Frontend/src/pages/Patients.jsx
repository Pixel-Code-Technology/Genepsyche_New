import React, { useState, useEffect } from "react";
import axios from "axios";
import PatientForm from "../components/PatientForm";
import ShowSelect from "../components/ShowSelect";
import PatientProfileModal from "../components/PatientProfile";

const API_URL = "http://localhost:3000/api/patients";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [showItems, setShowItems] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Profile Modal States
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // 🧩 Fetch all patients
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

  // ✅ Search Filter
  const filteredPatients = patients.filter((p) => {
    const s = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(s) ||
      p.email?.toLowerCase().includes(s) ||
      p.phone?.toLowerCase().includes(s)
    );
  });

  // ✅ Add or Update Patient
  const handleSavePatient = async (patientData) => {
    try {
      if (editingPatient) {
        const res = await axios.put(`${API_URL}/${editingPatient.id}`, patientData);
        if (res.data && res.data.data) {
          setPatients((prev) =>
            prev.map((p) => (p.id === editingPatient.id ? res.data.data : p))
          );
        }
      } else {
        const res = await axios.post(API_URL, patientData);
        if (res.data && res.data.data) {
          setPatients([...patients, res.data.data]);
        }
      }
      setShowForm(false);
      setEditingPatient(null);
    } catch (err) {
      console.error("❌ Error saving patient:", err);
      alert("Failed to save patient. Please try again.");
    }
  };

  // ✅ View Profile
  const handleView = (patient) => {
    setSelectedPatient(patient);
    setShowProfile(true);
  };

  // ✅ Edit Patient
  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  // ✅ Delete Patient
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
    <div className="patients-page p-6">
      {/* ===== Header Controls ===== */}
      <div className="page-header flex flex-wrap items-center gap-3 mb-6">
        <ShowSelect value={showItems} onChange={setShowItems} />

        {/* 🔍 Search Input */}
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          className="search-input border rounded-lg px-3 py-2 w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="create-btn bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => {
            setEditingPatient(null);
            setShowForm(true);
          }}
        >
          + ADD PATIENT
        </button>
      </div>

      {/* ===== Table ===== */}
      {loading ? (
        <p>Loading patients...</p>
      ) : error ? (
        <p className="error-text text-red-600">{error}</p>
      ) : (
        <div className="patients-table bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="table-header grid grid-cols-4 gap-4 px-6 py-3 font-semibold text-gray-700 border-b">
            <div>NAME</div>
            <div>EMAIL</div>
            <div>PHONE</div>
            <div>ACTIONS</div>
          </div>

          {filteredPatients.length === 0 ? (
            <div className="empty-state p-6 text-gray-500">No patients found.</div>
          ) : (
            filteredPatients.slice(0, showItems).map((patient) => (
              <div
                key={patient.id}
                className="table-row grid grid-cols-4 gap-4 px-6 py-3 border-b items-center text-gray-800"
              >
                <div>{patient.name}</div>
                <div>{patient.email}</div>
                <div>{patient.phone}</div>
                <div className="flex gap-2">
                  <button
                    className="action-btn text-blue-600 hover:underline"
                    onClick={() => handleView(patient)}
                  >
                    View
                  </button>
                  <button
                    className="action-btn text-green-600 hover:underline"
                    onClick={() => handleEdit(patient)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn text-red-600 hover:underline"
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

      {/* ===== View Profile Modal ===== */}
      {showProfile && (
        <PatientProfileModal
          patient={selectedPatient}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* ===== Create/Edit Patient Form ===== */}
      {showForm && (
        <PatientForm
          onClose={() => {
            setShowForm(false);
            setEditingPatient(null);
          }}
          onSave={handleSavePatient}
          patient={editingPatient}
        />
      )}
    </div>
  );
};

export default Patients;
