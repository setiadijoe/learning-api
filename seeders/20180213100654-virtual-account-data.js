'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('VirtualAccounts', [{
      account_id: 101010101,
      loan_id: 10000001,
      lender_account_id: null,
      first_name: 'Helio',
      last_name: 'Orowaro',
      bank_code: 'BCA',
      virtual_account_id: '7100002937461587989'
    },{
      account_id: 101010102,
      loan_id: null,
      lender_account_id: 10000001,
      first_name: 'Alam',
      last_name: 'Bahnasa',
      bank_code: 'BCA',
      virtual_account_id: '7100008791637617892'
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
