import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const FeedbackTracker = () => {
  const data = {
    labels: ["Open", "Resolved"],
    datasets: [
      {
        data: [142, 28],
        backgroundColor: ["#6c63ff", "#4caf50"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="chart-container">
      <h3>Feedback Tracker</h3>
      <p>Last 7 Days</p>
      <div
        style={{
          height: "200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Doughnut data={data} options={options} />
      </div>
      <div className="feedback-summary">
        <div className="feedback-item">
          <div className="feedback-count">164</div>
          <div className="feedback-label">Total Feedback</div>
        </div>
        <div className="feedback-item">
          <div className="feedback-count">1:42</div>
          <div className="feedback-label">Open</div>
        </div>
        <div className="feedback-item">
          <div className="feedback-count">2:8</div>
          <div className="feedback-label">Resolved</div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackTracker;
