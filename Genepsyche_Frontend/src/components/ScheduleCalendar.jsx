import React, { useState, useEffect } from "react";

const ScheduleCalendar = ({
  filter,
  selectedDate,
  onDateSelect,
  onShowCreateForm,
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [view, setView] = useState("month");
  const [dateStatus, setDateStatus] = useState({});
  const [bookings, setBookings] = useState([]); // store API data

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // 🔹 Fetch API Data
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/schedules");
        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          setBookings(result.data);

          // Build map for quick lookup
          const statusMap = {};
          result.data.forEach((item) => {
            const dateKey = new Date(item.startDate).toDateString();

            if (!statusMap[dateKey]) {
              statusMap[dateKey] = { hasBookings: false, hasAvailability: false };
            }

            if (item.status === "booked") {
              statusMap[dateKey].hasBookings = true;
            } else if (item.status === "available") {
              statusMap[dateKey].hasAvailability = true;
            }
          });

          setDateStatus(statusMap);
        }
      } catch (err) {
        console.error("Error fetching schedules:", err);
      }
    };

    fetchSchedules();
  }, []);

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const generateCalendarDays = () => {
    const days = [];
    const totalDays = 42;
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);

    // Previous month days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const prevMonthDays = getDaysInMonth(prevMonth);
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonthDays - i);
      days.push({ day: prevMonthDays - i, isCurrentMonth: false, date });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const dateKey = date.toDateString();
      days.push({
        day: i,
        isCurrentMonth: true,
        date,
        status: dateStatus[dateKey] || { hasBookings: false, hasAvailability: false },
      });
    }

    // Next month days
    const remainingDays = totalDays - days.length;
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i);
      days.push({ day: i, isCurrentMonth: false, date });
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateSelect(today);
  };

  const handleDateClick = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable past dates
    if (date < today) return;

    const dateKey = date.toDateString();
    const hasBookings = dateStatus[dateKey]?.hasBookings;

    // Prevent booking on already booked day
    if (hasBookings) {
      alert("This day already has booked appointments. Please select another date.");
      return;
    }

    onDateSelect(date);
    onShowCreateForm(date);
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();

  const isToday = (date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isSelected = (date) =>
    selectedDate &&
    date.getDate() === selectedDate.getDate() &&
    date.getMonth() === selectedDate.getMonth() &&
    date.getFullYear() === selectedDate.getFullYear();

  return (
    <div className="schedule-calendar">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button className="nav-btn" onClick={() => navigateMonth("prev")}>←</button>
          <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <button className="nav-btn" onClick={() => navigateMonth("next")}>→</button>
        </div>

        <div className="calendar-view-toggle">
          {["month", "week", "day", "list"].map((v) => (
            <button key={v} className={view === v ? "active" : ""} onClick={() => setView(v)}>
              {v.toUpperCase()}
            </button>
          ))}
        </div>

        <button className="today-btn" onClick={goToToday}>Today</button>
      </div>

      <div className="calendar-grid">
        <div className="week-days">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="week-day">{day}</div>
          ))}
        </div>

        <div className="calendar-days">
          {calendarDays.map((dayInfo, index) => {
            const date = dayInfo.date;
            const isPastDate = date < new Date().setHours(0, 0, 0, 0);
            const hasBookings = dayInfo.status?.hasBookings;
            const hasAvailability = dayInfo.status?.hasAvailability;

            return (
              <div
                key={index}
                className={`calendar-day
                  ${dayInfo.isCurrentMonth ? "current-month" : "other-month"}
                  ${isToday(date) ? "today" : ""}
                  ${isSelected(date) ? "selected" : ""}
                  ${isPastDate ? "disabled" : ""}
                `}
                onClick={() => !isPastDate && dayInfo.isCurrentMonth && handleDateClick(date)}
              >
                <span className="day-number">{dayInfo.day}</span>

                {dayInfo.isCurrentMonth && (
                  <div className="day-events">
                    {hasBookings && <div className="event-dot booked-dot"></div>}
                    {hasAvailability && <div className="event-dot available-dot"></div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="event-dot available-dot"></div>
          <span>Available slots</span>
        </div>
        <div className="legend-item">
          <div className="event-dot booked-dot"></div>
          <span>Booked appointments</span>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
