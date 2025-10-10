import React from "react";

const PopularServices = () => {
  const services = [
    { name: "Telehealth", patients: 3200 },
    { name: "Psychotherapy", patients: 2800 },
    { name: "Depression", patients: 1950 },
    { name: "Medication Management", patients: 1250 },
    { name: "Eating Disorder", patients: 850 },
    { name: "Psychosis", patients: 350 },
  ];

  const totalPatients = 10400;

  return (
    <div className="chart-container">
      <h3>Popular Services</h3>
      <p>Total {totalPatients.toLocaleString()} Patients</p>
      <div style={{ marginTop: "20px" }}>
        {services.map((service) => {
          const percentage = (service.patients / totalPatients) * 100;
          return (
            <div key={service.name} style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}
              >
                <span>{service.name}</span>
                <span>{service.patients.toLocaleString()}</span>
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
