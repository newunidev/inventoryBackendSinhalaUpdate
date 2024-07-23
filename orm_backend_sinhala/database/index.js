

// const { Sequelize } = require('sequelize');
// const config = require('../config');

// // Create a database connection pool
// const sequelize = new Sequelize({
//   username: config.development.username,
//   password: config.development.password,
//   database: config.development.database,
//   host: config.development.host,
//   dialect: config.development.dialact,
//   pool: {
//     max: 5, // Maximum number of connections in the pool
//     min: 0, // Minimum number of connections in the pool
//     acquire: 30000, // Maximum time (in milliseconds) that pool will try to get connection before throwing error
//     idle: 10000 // Maximum time (in milliseconds) that a connection can be idle before being released
//   }
// });

// // Test the database connection
// async function testConnection() {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connection has been established successfully');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }
 
// // Export the sequelize instance
// module.exports = sequelize;

// // Optionally, you can export the testConnection function as well if you want to explicitly test the database connection
// module.exports.testConnection = testConnection;

//==========================//

// const { Sequelize } = require('sequelize');
// const config = require('../config'); // Adjust the path if necessary

// const sequelize = new Sequelize({
//   username: config.development.username,
//   password: config.development.password,
//   database: config.development.database,
//   host: config.development.host,
//   dialect: config.development.dialect,
//   pool: {
//     max: 5, // Maximum number of connections in the pool
//     min: 0, // Minimum number of connections in the pool
//     acquire: 30000, // Maximum time (in milliseconds) that pool will try to get connection before throwing error
//     idle: 10000 // Maximum time (in milliseconds) that a connection can be idle before being released
//   }
// });

// async function testConnection() {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connection has been established successfully');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }

// testConnection();

// module.exports = sequelize;



const { Sequelize } = require('sequelize');
const config = require('../config'); // Adjust the path if necessary

const sequelize = new Sequelize({
  username: config.development.username,
  password: config.development.password,
  database: config.development.database,
  host: config.development.host,
  dialect: config.development.dialect, // Use the correct dialect property
  pool: {
    max: 5, // Maximum number of connections in the pool
    min: 0, // Minimum number of connections in the pool
    acquire: 30000, // Maximum time (in milliseconds) that pool will try to get connection before throwing error
    idle: 10000 // Maximum time (in milliseconds) that a connection can be idle before being released
  },
  dialectOptions: config.dialectOptions // Ensure dialectOptions are included
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

module.exports = sequelize; // Export sequelize directly
