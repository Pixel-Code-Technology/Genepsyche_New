import React, { useEffect, useState } from "react";
import ShowSelect from "../components/ShowSelect";
import CreatePaymentForm from "../components/paymentForm";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [showItems, setShowItems] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit | view

  // ✅ Fetch all payments
  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/payments");
      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.data)) {
        setPayments(data.data);
      } else {
        setError("Unexpected data format from server.");
      }
    } catch (err) {
      setError("Failed to connect to payment server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ✅ Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/payments/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Payment deleted successfully!");
        fetchPayments();
      } else {
        alert("Failed to delete payment.");
      }
    } catch (err) {
      alert("Server error while deleting payment.");
    }
  };

  // ✅ Filter for search
  const filteredPayments = payments.filter((p) => {
    const s = search.toLowerCase();
    return (
      p.patient?.name?.toLowerCase().includes(s) ||
      p.service?.name?.toLowerCase().includes(s) ||
      p.payment_code?.toLowerCase().includes(s) ||
      p.payment_type?.toLowerCase().includes(s) ||
      p.status?.toLowerCase().includes(s)
    );
  });

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "paid":
        return "status paid";
      case "pending":
        return "status pending";
      case "failed":
        return "status denied";
      default:
        return "status unknown";
    }
  };

  return (
    <div className="payments-page">
      {/* ==== HEADER CONTROLS ==== */}
      <div className="table-controls">
        <ShowSelect value={showItems} onChange={setShowItems} max={100} step={5} />
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search payments, patient, or code..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => {
              setMode("create");
              setSelectedPayment(null);
              setShowPaymentForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Payment
          </button>
        </div>
      </div>

      {/* ==== FORM POPUP ==== */}
      <CreatePaymentForm
        isOpen={showPaymentForm}          // ✅ controls open/close
        mode={mode}                       // create | edit | view
        paymentData={selectedPayment}     // prefill for edit/view
        onClose={() => setShowPaymentForm(false)}
        onCreatePayment={() => {
          fetchPayments();
          setShowPaymentForm(false);
        }}
      />


      {/* ==== TABLE ==== */}
      <div className="transactions">
        {error ? (
          <div className="error-box">
            <p>{error}</p>
            <button onClick={fetchPayments}>Retry</button>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>PATIENT</th>
                <th>SERVICE</th>
                <th>AMOUNT</th>
                <th>PAID BY</th>
                <th>INSURANCE</th>
                <th>RESPONSIBLE</th>
                <th>CODE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10">Loading payments...</td></tr>
              ) : filteredPayments.length > 0 ? (
                filteredPayments.slice(0, showItems).map((p) => (
                  <tr key={p.id}>
                    <td>{new Date(p.payment_date).toLocaleDateString()}</td>
                    <td>{p.patient?.name || "N/A"}</td>
                    <td>{p.service?.name || "N/A"}</td>
                    <td>${Number(p.amount || 0).toFixed(2)}</td>
                    <td>{p.payment_type === "insurance" ? "Insurance" : "Self-Pay"}</td>
                    <td>
                      {p.payment_type === "insurance"
                        ? `$${Number(p.insurance_coverage || 0).toFixed(2)}`
                        : "—"}
                    </td>
                    <td>
                      {p.payment_type === "insurance"
                        ? `$${Number(p.patient_responsible || 0).toFixed(2)}`
                        : `$${Number(p.amount || 0).toFixed(2)}`}
                    </td>
                    <td>{p.payment_code}</td>
                    <td>
                      <span className={getStatusClass(p.status)}>
                        {p.status}
                      </span>
                    </td>
                    <td className="flex gap-2 justify-center">
                      {/* View */}
                      <button
                        onClick={() => {
                          setMode("view");
                          setSelectedPayment(p);
                          setShowPaymentForm(true);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => {
                          setMode("edit");
                          setSelectedPayment(p);
                          setShowPaymentForm(true);
                        }}
                        className="text-green-600 hover:underline"
                      >
                        Edit
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="10">No payment records found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Payments;
