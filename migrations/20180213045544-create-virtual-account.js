'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    const tableName = 'VirtualAccounts'
    return queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      account_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      loan_id: {
        type: Sequelize.STRING
      },
      source: {
        allowNull: false,
        type: Sequelize.STRING
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      bank_code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      virtual_account_id: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
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
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('VirtualAccounts');
  }
};
