import React, { useState, useEffect } from "react";
import CreateScheduleForm from "./CreateScheduleForm";
import { SERVICES } from "../constants";

const API_SCHEDULES = "http://localhost:3000/api/schedules";
const API_PATIENTS = "http://localhost:3000/api/patients";

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch schedules & patients
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [scheduleRes, patientRes] = await Promise.all([
        fetch(API_SCHEDULES),
        fetch(API_PATIENTS),
      ]);

      const scheduleData = await scheduleRes.json();
      const patientData = await patientRes.json();

      if (scheduleData.success) setSchedules(scheduleData.data || []);
      if (patientData.success) setPatients(patientData.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load schedules or patients.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CRUD Handlers
  const handleCreateSchedule = async (scheduleData) => {
    try {
      const res = await fetch(API_SCHEDULES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData),
      });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (err) {
      console.error("Error creating schedule:", err);
    }
  };

  const handleUpdateSchedule = async (updatedData) => {
    try {
      const res = await fetch(`${API_SCHEDULES}/${updatedData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (err) {
      console.error("Error updating schedule:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    try {
      const res = await fetch(`${API_SCHEDULES}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (err) {
      console.error("Error deleting schedule:", err);
    }
  };

  // ✅ Helpers
  const getPatientName = (id) => {
    const patient = patients.find((p) => String(p.id) === String(id));
    return patient ? patient.name : "Unknown";
  };

  const getServiceName = (id) => {
    const s = SERVICES.find((srv) => srv.id === Number(id));
    return s ? s.name : "Unknown";
  };

  return (
    <div className="schedule-page">
      {/* ✅ Main Content */}
      {loading ? (
        <p>Loading schedules...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="schedule-table">
          {/* ✅ Table Header (7 columns) */}
          <div className="table-header">
            <div>TITLE</div>
            <div>PATIENT</div>
            <div>SERVICE</div>
            <div>DATE</div>
            <div>TIME</div>
            <div>STATUS</div>
            <div>ACTIONS</div>
          </div>

          {/* ✅ Table Rows */}
          {schedules.length === 0 ? (
            <div className="empty-state">No schedules found.</div>
          ) : (
            schedules.map((s) => (
              <div key={s.id} className="table-row">
                <div>{s.title}</div>
                <div>{getPatientName(s.patient)}</div>
                <div>{getServiceName(s.service)}</div>
                <div>
                  <span className="date-text">{s.startDate}</span>
                  <span className="arrow"> → </span>
                  <span className="date-text">{s.endDate}</span>
                </div>
                <div>
                  <span className="time-text">
                    {s.startTime} – {s.endTime}
                  </span>
                </div>
                <div className={`status ${s.status}`}>
                  {s.status?.toUpperCase()}
                </div>
                <div className="schedule-actions">
                  <button
                    className="action-btn"
                    onClick={() => {
                      setEditingSchedule(s);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(s.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ✅ Modal Form */}
      {showForm && (
        <CreateScheduleForm
          selectedDate={new Date()}
          onClose={() => setShowForm(false)}
          onCreateSchedule={handleCreateSchedule}
          onUpdateSchedule={handleUpdateSchedule}
          editingSchedule={editingSchedule}
        />
      )}
    </div>
  );
};

export default ScheduleList;
