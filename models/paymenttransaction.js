'use strict';
module.exports = (sequelize, DataTypes) => {
  var PaymentTransaction = sequelize.define('PaymentTransaction', {
    faspay_payment_id: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {});
  PaymentTransaction.associate = function(models) {
    // associations can be defined here
    models.PaymentTransaction.belongsTo(models.FaspayPayment, {
      foreignKey: 'faspay_payment_id'
    })
  };
  return PaymentTransaction;
};