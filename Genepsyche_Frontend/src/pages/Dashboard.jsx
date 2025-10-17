import React, { useEffect, useState } from "react";
import StatsCard from "../components/StatsCard";
import FeedbackTracker from "../components/FeedbackTracker";
import PopularServices from "../components/PopularServices";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!stats) return <p>No stats available</p>;

  return (
    <div className="dashboard">
      {/* Top Section */}
      <div className="dashboard-top">
        {/* Bookings Card */}
        <div className="booking-card">
          <StatsCard
            title="Bookings"
            value={stats.totalBookings}
            percentage={stats.progress.bookedPercent}
            comparison={`${stats.totalBookings} total bookings`}
          />
        </div>

        {/* Statistics Section */}
        <div className="statistics-section">
          <h3>Statistics</h3>
          <div className="stats-grid">
            <StatsCard title="Services" value={stats.totalServices} />
            <StatsCard title="Patients" value={stats.totalPatients} />
            <StatsCard title="Schedules" value={stats.totalSchedules} />
            <StatsCard title="Cancelled" value={stats.progress.cancelledPercent + "%"} />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="dashboard-bottom">
        <div className="popular-services-section">
          <PopularServices services={stats.popularServices} />
        </div>

        <div className="feedback-section">
          <FeedbackTracker />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
