const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const generateModels = require('./generateModels'); // Import the function to generate models
dotenv.config();

// Database credentials
const database = process.env.LIVE_DB_NAME;
const username = process.env.LIVE_DB_USERNAME;
const password = process.env.LIVE_DB_PASSWORD;
const port = process.env.LIVE_DB_PORT;
const host = process.env.LIVE_DB_HOST;
const dialect = 'postgres';


// Create a new Sequelize instance for connection
const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: dialect,
  port: port,
  logging: false, // Disable logging for production, set to true for debugging
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Adjust based on your server configuration
    },
  },
  define: {
    freezeTableName: true, // Prevent Sequelize from pluralizing table names
  },
  pool: {
    max: 5, // Max number of connections
    min: 0, // Min number of connections
    acquire: 30000, // Max time (in ms) to wait for a connection
    idle: 10000, // Max time (in ms) a connection can be idle before being released
  },
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;