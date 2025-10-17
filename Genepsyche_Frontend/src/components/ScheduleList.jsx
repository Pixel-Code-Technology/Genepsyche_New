import React, { useState, useEffect } from "react";
import CreateScheduleForm from "./CreateScheduleForm";
import { SERVICES } from "../constants";

const API_BASE = "http://localhost:3000/api"; // ✅ unified base URL
const API_SCHEDULES = `${API_BASE}/schedules`;
const API_PATIENTS = `${API_BASE}/patients`;

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

  // ✅ Create Schedule
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

  // ✅ Update Schedule
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

  // ✅ Delete Schedule
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

  // ✅ Status Change (inline)
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_SCHEDULES}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setSchedules((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // ✅ Render UI
  return (
    <div className="schedule-page">
      {loading ? (
        <p>Loading schedules...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="schedule-table">
          {/* Header */}
          <div className="table-header">
            <div>TITLE</div>
            <div>PATIENT</div>
            <div>SERVICE</div>
            <div>DATE</div>
            <div>TIME</div>
            <div>STATUS</div>
            <div>ACTIONS</div>
          </div>

          {/* Rows */}
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

                {/* ✅ Status Dropdown */}
                <select
                  value={s.status}
                  onChange={(e) => handleStatusChange(s.id, e.target.value)}
                  className="status-dropdown"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Initial Session">Initial Session</option>
                  <option value="Claim Submission">Claim Submission</option>
                  <option value="Follow Up">Follow Up</option>
                  <option value="Cancel Appointment">Cancel Appointment</option>
                </select>

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

      {/* Modal Form */}
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
