import React, { useState, useEffect } from "react";
import { SERVICES } from "../constants";

const CreateScheduleForm = ({
  selectedDate,
  onClose,
  onCreateSchedule,
  onUpdateSchedule,
  editingSchedule,
}) => {
  const isEditing = Boolean(editingSchedule);

  const [formData, setFormData] = useState({
    title: "",
    patient: "",
    service: "",
    startDate: selectedDate
      ? selectedDate.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    endDate: selectedDate
      ? selectedDate.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    startTime: "08:00",
    endTime: "09:00",
    description: "",
  });

  const [patients, setPatients] = useState([]);

  // ✅ Preload form when editing
  useEffect(() => {
    if (isEditing && editingSchedule) {
      setFormData({
        title: editingSchedule.title || "",
        patient: editingSchedule.patient || "",
        service: editingSchedule.service || "",
        startDate: editingSchedule.startDate || "",
        endDate: editingSchedule.endDate || "",
        startTime: editingSchedule.startTime || "08:00",
        endTime: editingSchedule.endTime || "09:00",
        description: editingSchedule.description || "",
      });
    }
  }, [editingSchedule, isEditing]);

  // ✅ Fetch patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/patients");
        const data = await res.json();
        if (data.success) {
          setPatients(data.data);
        }
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };
    fetchPatients();
  }, []);

  // ✅ Generate time slots (08:00–17:00)
  const timeSlots = [];
  for (let hour = 8; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      timeSlots.push(time);
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patient || !formData.service) return;

    if (isEditing) {
      onUpdateSchedule({ ...formData, id: editingSchedule.id });
    } else {
      onCreateSchedule({
        ...formData,
        status: "booked",
      });
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{isEditing ? "Edit Schedule" : "Create Schedule"}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter schedule title"
              required
            />
          </div>

          {/* Dates */}
          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Times */}
          <div className="form-row">
            <div className="form-group">
              <label>Start Time *</label>
              <select
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>End Time *</label>
              <select
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Patient & Service */}
          <div className="form-row">
            <div className="form-group">
              <label>Patient *</label>
              <select
                name="patient"
                value={formData.patient}
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

            <div className="form-group">
              <label>Service *</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="">Select Service</option>
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
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
              placeholder="Enter schedule description"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {isEditing ? "Update Schedule" : "Create Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScheduleForm;
