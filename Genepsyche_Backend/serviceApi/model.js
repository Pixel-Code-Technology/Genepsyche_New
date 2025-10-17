// Genepsyche_Backend/serviceApi/model.js
const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Service = db.define(
  'Service',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'services',
    timestamps: true,
  }
);

module.exports = Service;
