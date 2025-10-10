import React from "react";
import StatsCard from "../components/StatsCard";
import FeedbackTracker from "../components/FeedbackTracker";
import PopularServices from "../components/PopularServices";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-top">
        <div className="booking-card">
          <StatsCard
            title="Bookings"
            value="82.5k"
            percentage="78"
            comparison="26 bookings more than last month"
          />
        </div>

        <div className="statistics-section">
          <h3>Statistics</h3>
          <div className="stats-grid">
            <StatsCard title="Services" value="12" />
            <StatsCard title="Patients" value="123" />
            <StatsCard title="Schedules" value="789" />
            <StatsCard title="Revenues" value="$9745" />
          </div>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="popular-services-section">
          <PopularServices />
        </div>

        <div className="feedback-section">
          <FeedbackTracker />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
