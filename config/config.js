require('dotenv').config()

module.exports = {
  development: {
    username: process.env.DB_DEV_USER || 'postgres',
    password: process.env.DB_DEV_PASS || 'postgres',
    database: process.env.DB_DEV || 'faspay-payment',
    host: process.env.DB_DEV_HOST || 'localhost',
    port: process.env.DB_DEV_PORT || 5432,
    dialect: process.env.DB_DEV_DIALECT || 'postgres',
    logging: console.log
  },
  test: {
    username: process.env.DB_TEST_USER || 'postgres',
    password: process.env.DB_TEST_PASS || 'postgres',
    database: process.env.DB_TEST || 'faspay-payment-test',
    host: process.env.DB_TEST_HOST || 'localhost',
    dialect: process.env.DB_TEST_DIALECT || 'postgres',
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
}
