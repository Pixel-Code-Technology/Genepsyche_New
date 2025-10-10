const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'genepsyche',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // disable logging SQL queries
  }
);

// Test connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL database via Sequelize');
  } catch (err) {
    console.error('Unable to connect to the database:', err.message);
  }
})();

module.exports = sequelize;
