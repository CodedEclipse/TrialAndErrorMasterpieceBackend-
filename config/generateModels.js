const SequelizeAuto = require('sequelize-auto');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Function to generate Sequelize models automatically based on database tables
 */
const generateModels = () => {
  const database = process.env.LIVE_DB_NAME;
  const username = process.env.LIVE_DB_USERNAME;
  const password = process.env.LIVE_DB_PASSWORD;
  const port = process.env.LIVE_DB_PORT;
  const host = process.env.LIVE_DB_HOST;
  const dialect = 'postgres';

  const auto = new SequelizeAuto(database, username, password, {
    host: host,
    dialect: dialect,
    port: port,
    directory: path.join(__dirname, '../models'), // Path where models will be saved
    additional: {
      timestamps: false, // Adjust based on your DB structure
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Adjust based on your server configuration
      },
    },
    logging: false, // Disable logging, or set to true for debugging
  });

  auto.run()
    .then(() => {
      console.log('Models have been generated successfully.');
    })
    .catch((err) => {
      console.error('Error generating models:', err);
    });
};

module.exports = generateModels;
