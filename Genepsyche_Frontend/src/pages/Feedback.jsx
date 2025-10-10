import React, { useState } from "react";
import ShowSelect from "../components/ShowSelect";

function Feedback() {
  const [search, setSearch] = useState("");
  const [showItems, setShowItems] = useState(5);

  const [feedbacks] = useState([
    {
      id: 1,
      date: "2025-09-10",
      name: "Waqas Ahmed",
      email: "waqas@gmail.com",
      message:
        "Excellent service! The doctor was very professional and caring.",
      status: "Resolved",
    },
    {
      id: 2,
      date: "2025-09-11",
      name: "Ali Khan",
      email: "ali@gmail.com",
      message: "Waiting time was too long, but the consultation was good.",
      status: "In Progress",
    },
    {
      id: 3,
      date: "2025-09-12",
      name: "Ahmed Raza",
      email: "ahmed@gmail.com",
      message: "Not satisfied with the treatment plan provided.",
      status: "Open",
    },
    {
      id: 4,
      date: "2025-09-13",
      name: "Sara Khan",
      email: "sara@gmail.com",
      message: "Amazing experience! Staff was very helpful and supportive.",
      status: "Resolved",
    },
    {
      id: 5,
      date: "2025-09-14",
      name: "Fatima Ali",
      email: "fatima@gmail.com",
      message:
        "The clinic was clean and well-maintained. Good service overall.",
      status: "Open",
    },
  ]);

  const filteredFeedbacks = feedbacks.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase()) ||
      f.status.toLowerCase().includes(search.toLowerCase()) ||
      f.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="feedback-page">
      <div className="table-controls">
        <ShowSelect
          value={showItems}
          onChange={setShowItems}
          max={100}
          step={5}
        />

        <div>
          <input
            type="text"
            placeholder="Search feedback..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="feedback-table-container">
        <table className="table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>MESSAGE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.length > 0 ? (
              filteredFeedbacks.slice(0, showItems).map((f) => (
                <tr key={f.id}>
                  <td>{f.date}</td>
                  <td>{f.name}</td>
                  <td>{f.email}</td>
                  <td className="message-cell">
                    <div className="message-preview" title={f.message}>
                      {f.message.length > 60
                        ? `${f.message.substring(0, 60)}...`
                        : f.message}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status ${f.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-view" title="View Details">
                        👁️
                      </button>
                      <button className="btn-edit" title="Edit Status">
                        ✏️
                      </button>
                      <button className="btn-delete" title="Delete Feedback">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No feedback found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div className="showing-entries">
          Showing {Math.min(filteredFeedbacks.length, showItems)} of{" "}
          {filteredFeedbacks.length} entries
        </div>
        <div className="pagination">
          <button className="pagination-btn" disabled>
            Previous
          </button>
          <span className="pagination-info">Page 1 of 1</span>
          <button className="pagination-btn" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
