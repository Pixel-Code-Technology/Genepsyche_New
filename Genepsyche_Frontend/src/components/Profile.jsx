import React, { useEffect, useState } from "react";
import axios from "axios";

const API_PATIENTS = "http://localhost:3000/api/patients";
const API_SCHEDULES = "http://localhost:3000/api/schedules";

const PatientProfile = ({ patientId }) => {
  const [patient, setPatient] = useState(null);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch patient + schedule data
  useEffect(() => {
    if (!patientId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // 🧩 Fetch all patients
        const resPatient = await axios.get(API_PATIENTS);
        const allPatients = resPatient.data?.data || [];
        const currentPatient = allPatients.find((p) => p.id === patientId);

        if (!currentPatient) {
          setError("Patient not found.");
          setLoading(false);
          return;
        }

        // 🩺 Fetch schedules and count appointments for this patient
        const resSchedule = await axios.get(API_SCHEDULES);
        const allSchedules = resSchedule.data?.data || [];
        const patientSchedules = allSchedules.filter(
          (s) => String(s.patient) === String(patientId)
        );

        setPatient(currentPatient);
        setAppointmentCount(patientSchedules.length);
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
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
    <div className="patient-profile-container">
      {/* LEFT SIDE */}
      <div className="patient-profile-left">
        <div className="patient-profile-image">
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
        <button className="edit-profile-btn">
          Edit Profile
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="patient-profile-right">
        <div>
          <span className="font-semibold block">Status</span>
          <span className="text-green-600 font-medium">Active</span>
        </div>
        <div>
          <span className="font-semibold block">Service</span>
          <span>{patient.department || "Cardiology"}</span>
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
          <span className="font-semibold block">Appointment</span>
          <span>{appointmentCount}</span>
        </div>
        <div>
          <span className="font-semibold block">Patient ID</span>
          <span>#{patient.id.toString().padStart(4, "0")}</span>
        </div>
        <div>
          <span className="font-semibold block">Phone</span>
          <span>{patient.phone || "N/A"}</span>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
