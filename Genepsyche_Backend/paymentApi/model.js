const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Patient = require("../patientApi/model");
const Service = require("../serviceApi/model");

// 💳 Payment Model
const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  service_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  payment_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  payment_type: {
    type: DataTypes.ENUM("insurance", "self-pay"),
    allowNull: false,
  },
  insurance_coverage: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  patient_responsible: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "completed", "failed"),
    defaultValue: "pending",
  },
  payment_date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
});

// ✅ Associations
Payment.belongsTo(Patient, {
  foreignKey: "patient_id",
  as: "patient",
});

Payment.belongsTo(Service, {
  foreignKey: "service_id",
  as: "service",
});

module.exports = Payment;
