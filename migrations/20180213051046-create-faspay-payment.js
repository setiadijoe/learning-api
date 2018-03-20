'use strict'

const { createAuditTriggerQuery } = require('./../utils/migration')

module.exports = {
  up: function (queryInterface, Sequelize) {
    const tableName = 'FaspayPayments'

    return queryInterface.createTable('FaspayPayments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      virtual_account: {
        type: Sequelize.STRING
      },
      transaction_id: {
        type: Sequelize.STRING,
        unique: true
      },
      merchant_id: {
        type: Sequelize.STRING
      },
      bill_no: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      status_code: {
        type: Sequelize.STRING
      },
      status_desc: {
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
    }).then(() => queryInterface.sequelize.query(createAuditTriggerQuery(tableName)))
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('FaspayPayments')
  }
}
