'use strict';
module.exports = function(sequelize, DataTypes) {
  var FaspayPayment = sequelize.define('FaspayPayment', {
    virtual_account: DataTypes.STRING,
    transaction_id: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    status: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return FaspayPayment;
};