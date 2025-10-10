import React, { useState } from "react";
import ShowSelect from "../components/ShowSelect"; // ✅ import it

function Payments() {
  const [search, setSearch] = useState("");
  const [showItems, setShowItems] = useState(5);

  const [transactions] = useState([
    {
      id: 1,
      date: "2025-09-10",
      amount: 200,
      patient: "Waqas",
      email: "waqas@gmail.com",
      status: "Completed",
    },
    {
      id: 2,
      date: "2025-09-11",
      amount: 150,
      patient: "Ali",
      email: "ali@gmail.com",
      status: "Pending",
    },
    {
      id: 3,
      date: "2025-09-12",
      amount: 500,
      patient: "Ahmed",
      email: "ahmed@gmail.com",
      status: "Failed",
    },
    {
      id: 4,
      date: "2025-09-13",
      amount: 300,
      patient: "Sara",
      email: "sara@gmail.com",
      status: "Completed",
    },
  ]);

  const filteredTransactions = transactions.filter(
    (t) =>
      t.patient.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="payments-page">
      <div className="table-controls">
        {/* ✅ Reusable Component */}
        <ShowSelect
          value={showItems}
          onChange={setShowItems}
          max={100}
          step={5}
        />

        <div>
          <input
            type="text"
            placeholder="Search Transaction"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="transactions">
        <table className="table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>AMOUNT</th>
              <th>PATIENT</th>
              <th>USER EMAIL</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.slice(0, showItems).map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>${t.amount}</td>
                  <td>{t.patient}</td>
                  <td>{t.email}</td>
                  <td>
                    <span className={`status ${t.status.toLowerCase()}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Payments;
