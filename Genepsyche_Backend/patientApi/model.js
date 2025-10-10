// Genepsyche_Backend/patientApi/model.js
const { DataTypes } = require('sequelize');
const db = require('../config/db');

// ✅ Define the Patient model
const Patient = db.define(
  'Patient',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Please enter a valid email address' },
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    tableName: 'patients',
    timestamps: true, // adds createdAt & updatedAt
    underscored: true, // optional: converts camelCase → snake_case in DB
  }
);

module.exports = Patient;
