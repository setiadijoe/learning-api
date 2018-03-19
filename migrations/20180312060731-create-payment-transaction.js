'use strict';
const { createAuditTriggerQuery } = require('./../utils/migration')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const tableName = 'PaymentTransactions'
    return queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      faspay_payment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'FaspayPayments',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    }).then(() => queryInterface.sequelize.query(createAuditTriggerQuery(tableName)));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PaymentTransactions');
  }
};