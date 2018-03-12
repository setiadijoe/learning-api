'use strict';
module.exports = (sequelize, DataTypes) => {
  var Repayment = sequelize.define('Repayment', {
    faspay_payment_id: DataTypes.Integer,
    status: DataTypes.STRING
  }, {});
  Repayment.associate = function(models) {
    // associations can be defined here
    Repayment.hasOne(models.FaspayPayment)
  };
  return Repayment;
};