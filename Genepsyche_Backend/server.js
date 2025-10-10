// Genepsyche_Backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Initialize Express
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
const db = require('./config/db');

// Import Models
const User = require('./userRegisteration/model');
const Patient = require('./patientApi/model');
const Schedule = require('./scheduleApi/model'); // ✅ Added Schedule Model

// ==========================
// 🔁 Database Synchronization
// ==========================
async function syncDatabase() {
  try {
    console.log('Starting database synchronization...');
    await db.sync({ alter: true });
    console.log('✅ Database synchronization completed successfully');
  } catch (error) {
    console.error('❌ Database synchronization failed:', error.message);
  }
}

// ==========================
// 🚦 Routes Setup
// ==========================
const userRegistrationRoutes = require('./userRegisteration/routes');
const patientRoutes = require('./patientApi/routes');
const scheduleRoutes = require('./scheduleApi/routes'); // ✅ Added Schedule Routes

app.use('/api/auth', userRegistrationRoutes);
app.use('/api', patientRoutes);
app.use('/api', scheduleRoutes); // ✅ Mount new Schedule API

// ==========================
// 🌐 Root Route
// ==========================
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Genepsyche Backend API is running!',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        getAllUsers: 'GET /api/auth/users',
      },
      patients: {
        createPatient: 'POST /api/patients',
        getAllPatients: 'GET /api/patients',
        getPatient: 'GET /api/patients/:id',
        updatePatient: 'PUT /api/patients/:id',
        deletePatient: 'DELETE /api/patients/:id',
      },
      schedules: { // ✅ Added schedule API endpoints
        createSchedule: 'POST /api/schedules',
        getAllSchedules: 'GET /api/schedules',
        getScheduleById: 'GET /api/schedules/:id',
        updateSchedule: 'PUT /api/schedules/:id',
        deleteSchedule: 'DELETE /api/schedules/:id',
      },
    },
  });
});

// ==========================
// 🩺 Health Check Endpoint
// ==========================
app.get('/health', async (req, res) => {
  try {
    await db.authenticate();
    res.status(200).json({
      status: 'OK',
      database: 'Connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      database: 'Disconnected',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ==========================
// ⚠️ Error Handling Middleware
// ==========================
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// ==========================
// 🚫 404 Not Found Handler
// ==========================
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
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
      console.log(`🔗 Patient API:   http://localhost:${PORT}/api/patients`);
      console.log(`🔗 Schedule API:  http://localhost:${PORT}/api/schedules`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
