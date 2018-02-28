require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_ADMINSER_USER || 'taralite',
    password: process.env.DB_ADMINSER_PASS || 'taralite2015',
    database: process.env.DB_ADMINSER || 'admin-migration-2911',
    host: process.env.DB_ADMINSER_HOST || 'taralite-prod-280517-replica1.cuifbhul64nx.ap-southeast-1.rds.amazonaws.com',
    port: process.env.DB_ADMINSER_PORT || 5432,
    dialect: process.env.DB_ADMINSER_DIALECT || 'postgres',
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