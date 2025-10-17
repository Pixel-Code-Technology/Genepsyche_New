// Genepsyche_Backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// ==========================
// 🚀 Initialize Express
// ==========================
const app = express();

// ==========================
// 🔧 Middleware Setup
// ==========================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==========================
// 🗄️ Database Setup
// ==========================
const db = require("./config/db");

// ==========================
// 📦 Import Models
// ==========================
const User = require("./userRegisteration/model");
const Patient = require("./patientApi/model");
const Schedule = require("./scheduleApi/model");
const Service = require("./serviceApi/model");
const Payment = require("./paymentApi/model");

// ==========================
// 🔗 Define Relationships
// ==========================
// One patient can have many payments
Patient.hasMany(Payment, { foreignKey: "patient_id", onDelete: "CASCADE" });
Payment.belongsTo(Patient, { foreignKey: "patient_id" });

// One service can have many payments
Service.hasMany(Payment, { foreignKey: "service_id", onDelete: "SET NULL" });
Payment.belongsTo(Service, { foreignKey: "service_id" });

// One patient can have many schedules
Patient.hasMany(Schedule, { foreignKey: "patient_id", onDelete: "CASCADE" });
Schedule.belongsTo(Patient, { foreignKey: "patient_id" });

// ==========================
// 🌱 Database Sync + Seeding
// ==========================
const seedServices = require("./serviceApi/seed");

async function syncDatabase() {
  try {
    console.log("🛠️ Starting database synchronization...");
    await db.sync({ alter: true });
    console.log("✅ Database synchronized successfully.");

    // 🌱 Seed default services (if empty)
    await seedServices();
  } catch (error) {
    console.error("❌ Database synchronization failed:", error.message);
  }
}

// ==========================
// 🧩 Route Imports
// ==========================
const userRegistrationRoutes = require("./userRegisteration/routes");
const patientRoutes = require("./patientApi/routes");
const scheduleRoutes = require("./scheduleApi/routes");
const statsRoutes = require("./statsApi/routes");
const serviceRoutes = require("./serviceApi/routes");
const paymentRoutes = require("./paymentApi/routes");

// ==========================
// 🚦 Mount Routes
// ==========================
app.use("/api/auth", userRegistrationRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/payments", paymentRoutes);

// ==========================
// 🌐 Root Route
// ==========================
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Genepsyche Backend API is running!",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        getAllUsers: "GET /api/auth/users",
      },
      patients: {
        create: "POST /api/patients",
        getAll: "GET /api/patients",
        getById: "GET /api/patients/:id",
        update: "PUT /api/patients/:id",
        delete: "DELETE /api/patients/:id",
      },
      schedules: {
        create: "POST /api/schedules",
        getAll: "GET /api/schedules",
        getById: "GET /api/schedules/:id",
        update: "PUT /api/schedules/:id",
        delete: "DELETE /api/schedules/:id",
      },
      services: {
        create: "POST /api/services",
        getAll: "GET /api/services",
        update: "PUT /api/services/:id",
        delete: "DELETE /api/services/:id",
      },
      payments: {
        create: "POST /api/payments",
        getAll: "GET /api/payments",
        getById: "GET /api/payments/:id",
        update: "PUT /api/payments/:id",
        delete: "DELETE /api/payments/:id",
      },
      stats: {
        getStats: "GET /api/stats",
      },
    },
  });
});

// ==========================
// 🩺 Health Check
// ==========================
app.get("/health", async (req, res) => {
  try {
    await db.authenticate();
    res.status(200).json({
      status: "OK",
      database: "Connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      database: "Disconnected",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ==========================
// ⚠️ Global Error Handler
// ==========================
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// ==========================
// 🚫 404 Handler
// ==========================
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ==========================
// 🚀 Start Server
// ==========================
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await syncDatabase();

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🔗 Auth API:      http://localhost:${PORT}/api/auth`);
      console.log(`🧍 Patient API:   http://localhost:${PORT}/api/patients`);
      console.log(`📅 Schedule API:  http://localhost:${PORT}/api/schedules`);
      console.log(`💳 Payment API:   http://localhost:${PORT}/api/payments`);
      console.log(`🧾 Service API:   http://localhost:${PORT}/api/services`);
      console.log(`📊 Stats API:     http://localhost:${PORT}/api/stats`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
