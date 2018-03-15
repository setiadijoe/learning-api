require('dotenv').config();

module.exports = {
  development: {
    user: process.env.DB_LOCAL_USER || 'postgres',
    password: process.env.DB_LOCAL_PASS || 'postgres',
    database: process.env.DB_LOCAL || 'admin-service',
    host: process.env.DB_LOCAL_HOST || 'localhost',
    port: process.env.DB_LOCAL_PORT || 5432,
    dialect: process.env.DB_LOCAL_DIALECT || 'postgres',
    logging: console.log
  },
  test: {
    username: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASS,
    database: process.env.DB_TEST,
    host: process.env.DB_TEST_HOST,
    dialect: process.env.DB_TEST_DIALECT,
    logging: false
  },
  production: {
    username: process.env.DB_PRD_USER,
    password: process.env.DB_PRD_PASS,
    database: process.env.DB_PRD,
    host: process.env.DB_PRD_HOST,
    port: process.env.DB_PRD_PORT,
    dialect: process.env.DB_PRD_DIALECT,
    logging: false
  }
};