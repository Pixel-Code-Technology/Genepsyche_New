import React, { useEffect, useState } from "react";
import axios from "axios";

const API_PATIENTS = "http://localhost:3000/api/patients";
const API_SCHEDULES = "http://localhost:3000/api/schedules";
const API_PAYMENTS = "http://localhost:3000/api/payments";

const PatientProfile = ({ patientId }) => {
  const [patient, setPatient] = useState(null);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0); // always a number
  const [lastPayment, setLastPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patientId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch patients
        const resPatient = await axios.get(API_PATIENTS);
        const allPatients = resPatient.data?.data || [];
        const currentPatient = allPatients.find((p) => p.id === patientId);

        if (!currentPatient) {
          setError("Patient not found.");
          setLoading(false);
          return;
        }

        // Fetch schedules (appointments)
        const resSchedule = await axios.get(API_SCHEDULES);
        const allSchedules = resSchedule.data?.data || [];
        const patientSchedules = allSchedules.filter(
          (s) => String(s.patient) === String(patientId)
        );

        // Fetch payments for this patient
        const resPayments = await axios.get(API_PAYMENTS);
        const allPayments = Array.isArray(resPayments.data?.data)
          ? resPayments.data.data
          : resPayments.data || [];

        const patientPayments = allPayments.filter(
          (p) => String(p.patient_id) === String(patientId)
        );

        // Convert amounts to numbers and sum safely
        const totalPaid = patientPayments.reduce((sum, p) => {
          // p.amount might be string, null, or undefined — coerce to number
          const amt = Number(p.amount);
          if (Number.isFinite(amt)) return sum + amt;
          return sum;
        }, 0);

        // Find most recent payment by date (if payment_date exists)
        const latestPayment =
          patientPayments.length > 0
            ? patientPayments
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.payment_date || b.createdAt) -
                    new Date(a.payment_date || a.createdAt)
                )[0]
            : null;

        // ensure numeric state
        setPatient(currentPatient);
        setAppointmentCount(patientSchedules.length);
        setTotalPayments(Number(totalPaid) || 0);
        setLastPayment(latestPayment);
      } catch (err) {
        console.error("❌ Error fetching patient profile:", err);
        setError("Failed to load patient data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  if (loading) return <p className="text-gray-600 p-4">Loading profile...</p>;
  if (error) return <p className="text-red-600 p-4">{error}</p>;
  if (!patient) return null;

  return (
    <div className="patient-profile-container bg-white rounded-xl shadow-lg p-6 flex gap-8">
      {/* LEFT */}
      <div className="patient-profile-left flex flex-col items-center border-r pr-6">
        <div className="patient-profile-image w-28 h-28 rounded-full overflow-hidden mb-3">
          <img
            src={
              patient.photoUrl ||
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop&crop=faces"
            }
            alt={patient.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          {patient.title || "Mr."} {patient.name}
        </h2>
        <p className="text-gray-500 text-sm">{patient.email}</p>
        <button className="mt-3 border border-red-500 text-red-500 px-4 py-1 rounded-full hover:bg-red-50 transition">
          Edit Profile
        </button>
      </div>

      {/* RIGHT */}
      <div className="patient-profile-right grid grid-cols-2 gap-x-10 gap-y-4 text-sm text-gray-700">
        <div>
          <span className="font-semibold block">Status</span>
          <span className="text-green-600 font-medium">Active</span>
        </div>

        <div>
          <span className="font-semibold block">Registered Date</span>
          <span>
            {new Date(patient.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <div>
          <span className="font-semibold block">Appointments</span>
          <span>{appointmentCount}</span>
        </div>

        <div>
          <span className="font-semibold block">Patient ID</span>
          <span>#{String(patient.id).padStart(4, "0")}</span>
        </div>

        <div>
          <span className="font-semibold block">Phone</span>
          <span>{patient.phone || "N/A"}</span>
        </div>

        <div>
          <span className="font-semibold block">Total Payments</span>
          <span>${(Number(totalPayments) || 0).toFixed(2)}</span>
        </div>

        {lastPayment && (
          <>
            <div>
              <span className="font-semibold block">Last Payment Date</span>
              <span>
                {lastPayment.payment_date ||
                  lastPayment.createdAt ||
                  "—"}
              </span>
            </div>
            <div>
              <span className="font-semibold block">Last Payment Status</span>
              <span
                className={
                  lastPayment.status === "completed"
                    ? "text-green-600 font-medium"
                    : lastPayment.status === "pending"
                    ? "text-yellow-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {lastPayment.status}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;
