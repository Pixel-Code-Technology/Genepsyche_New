import React from "react";

const StatsCard = ({ title, value, comparison, percentage }) => {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <div className="value">{value}</div>
      {comparison && percentage && (
        <div className="comparison">
          <span>{percentage}%</span>
          <span style={{ marginLeft: "5px" }}>{comparison}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
