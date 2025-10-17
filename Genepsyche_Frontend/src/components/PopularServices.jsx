import React from "react";

const PopularServices = ({ services = [] }) => {
  const totalCount = services.reduce(
    (sum, item) => sum + parseInt(item.count || 0),
    0
  );

  return (
    <div className="chart-container">
      <h3>Popular Services</h3>
      <p>Total {totalCount.toLocaleString()} Bookings</p>

      <div style={{ marginTop: "20px" }}>
        {services.length === 0 && <p>No service data available</p>}

        {services.map((service) => {
          const percentage = totalCount
            ? ((service.count / totalCount) * 100).toFixed(1)
            : 0;

          return (
            <div key={service.id} style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}
              >
                <span>{service.name}</span> {/* ✅ now shows real name */}
                <span>{service.count}</span>
              </div>

              <div
                style={{
                  height: "8px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    backgroundColor: "#6c63ff",
                    width: `${percentage}%`,
                    transition: "width 0.3s ease",
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularServices;
