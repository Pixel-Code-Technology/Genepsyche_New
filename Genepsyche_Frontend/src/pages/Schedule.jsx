import React, { useState } from "react";
import axios from "axios";
import ScheduleList from "../components/ScheduleList";
import ScheduleCalendar from "../components/ScheduleCalendar";
import CreateScheduleForm from "../components/CreateScheduleForm";

const Schedule = () => {
  const [activeView, setActiveView] = useState("list");
  const [filter, setFilter] = useState("all");
  const [showItems, setShowItems] = useState(5);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formDate, setFormDate] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const handleGenerateSchedules = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleShowCreateForm = (date) => {
    setFormDate(date);
    setShowCreateForm(true);
  };

  const handleCreateSchedule = async (newSchedule) => {
    try {
      const res = await axios.post("http://localhost:3000/api/schedules", newSchedule);

      if (res.data.success) {
        setRefreshTrigger((prev) => prev + 1);
        alert("✅ Schedule created successfully!");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        console.error("❌ Error saving schedule:", error);
        alert("Something went wrong while saving the schedule.");
      }
    }
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setFormDate(null);
    setEditingSchedule(null);
  };

  return (
    <div className="schedule-page">
      <div className="page-header">
        <div className="schedule-view-toggle">
          <button
            className={activeView === "list" ? "active" : ""}
            onClick={() => setActiveView("list")}
          >
            List
          </button>
          <button
            className={activeView === "calendar" ? "active" : ""}
            onClick={() => setActiveView("calendar")}
          >
            Calendar
          </button>
        </div>

        <div className="schedule-filters">
          <div className="filter-group">
            <span className="filter-label">Filter:</span>
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              View all
            </button>
            <button
              className={filter === "available" ? "active" : ""}
              onClick={() => setFilter("available")}
            >
              Available
            </button>
            <button
              className={filter === "booked" ? "active" : ""}
              onClick={() => setFilter("booked")}
            >
              Booked
            </button>
          </div>
        </div>

        <div className="schedule-actions">
          <select
            className="show-select"
            value={showItems}
            onChange={(e) => setShowItems(Number(e.target.value))}
          >
            {Array.from({ length: 20 }, (_, i) => (i + 1) * 5).map((num) => (
              <option key={num} value={num}>
                Show {num}
              </option>
            ))}
          </select>

          <button
            className="create-btn"
            onClick={() => handleShowCreateForm(selectedDate)}
          >
            + CREATE SCHEDULE
          </button>
          <button className="generate-btn" onClick={handleGenerateSchedules}>
            GENERATE SCHEDULES
          </button>
        </div>
      </div>

      {activeView === "list" ? (
        <ScheduleList
          filter={filter}
          showItems={showItems}
          selectedDate={selectedDate}
          refreshTrigger={refreshTrigger}
          onGenerateSchedules={handleGenerateSchedules}
        />
      ) : (
        <ScheduleCalendar
          filter={filter}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onShowCreateForm={handleShowCreateForm}
        />
      )}

      {showCreateForm && formDate && (
        <CreateScheduleForm
          selectedDate={formDate}
          onClose={handleCloseForm}
          onCreateSchedule={handleCreateSchedule}
          onUpdateSchedule={() => {}}
          editingSchedule={editingSchedule}
        />
      )}
    </div>
  );
};

export default Schedule;
