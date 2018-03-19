'use strict';
module.exports = (sequelize, DataTypes) => {
  var Repayment = sequelize.define('Repayment', {
    faspay_payment_id: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {});
  Repayment.associate = function(models) {
    // associations can be defined here
    models.Repayment.belongsTo(models.FaspayPayment, {
      foreignKey: 'faspay_payment_id'
    })
  };
  return Repayment;
};