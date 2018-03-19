'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('VirtualAccounts', [{
      account_id: 101010101,
      source: 'LenderAccount',
      first_name: 'Helio',
      last_name: 'Orowaro',
      bank_code: 'BCA',
      virtual_account_id: '7100002937461587989'
    }, {
      account_id: 101010102,
      source: 'LoanAccount',
      first_name: 'Alam',
      last_name: 'Bahnasa',
      bank_code: 'BCA',
      virtual_account_id: '7100008791637617892'
    }], {})
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
}
