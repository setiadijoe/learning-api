'use strict';
module.exports = function(sequelize, DataTypes) {
  var FaspayPayment = sequelize.define('FaspayPayment', {
    virtual_account: DataTypes.STRING,
    transaction_id: DataTypes.STRING,
    merchant_id: DataTypes.STRING,
    bill_no: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    status_code: DataTypes.STRING,
    status_desc: DataTypes.STRING,
    transaction_date: DataTypes.DATE
  });
  FaspayPayment.associate = function (models) {
    models.FaspayPayment.hasOne(models.Repayment)
  }
  return FaspayPayment;
};