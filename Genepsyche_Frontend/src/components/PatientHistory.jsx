import React from "react";

const PatientHistory = ({ history = [] }) => {
  if (!history.length) {
    history = [
      {
        date: "20 Jan, 2023",
        diagnosis: "Malaria",
        severity: "High",
        visits: 2,
        status: "Under Treatment",
      },
      {
        date: "12 Jan, 2022",
        diagnosis: "Viral Fever",
        severity: "Low",
        visits: 1,
        status: "Cured",
      },
      {
        date: "20 Jan, 2021",
        diagnosis: "Covid 19",
        severity: "High",
        visits: 6,
        status: "Cured",
      },
    ];
  }

  return (
    <div className="patient-history">
      <div className="history-header">
        <h3>Patient History</h3>
        <span className="total-visits">Total {history.reduce((a, b) => a + b.visits, 0)} Visits</span>
      </div>

      <table className="history-table">
        <thead>
          <tr>
            <th>Date Of Visit</th>
            <th>Diagnosis</th>
            <th>Severity</th>
            <th>Total Visits</th>
            <th>Status</th>
            <th>Documents</th>
          </tr>
        </thead>
        <tbody>
          {history.map((record, index) => (
            <tr key={index}>
              <td>{record.date}</td>
              <td>{record.diagnosis}</td>
              <td>
                <span
                  className={`tag ${
                    record.severity === "High" ? "tag-high" : "tag-low"
                  }`}
                >
                  {record.severity}
                </span>
              </td>
              <td>{record.visits}</td>
              <td>
                <span
                  className={`status-tag ${
                    record.status === "Cured" ? "status-cured" : "status-treatment"
                  }`}
                >
                  {record.status}
                </span>
              </td>
              <td>
                <a href="#" className="download-link">
                  <i className="fas fa-download"></i> Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientHistory;
