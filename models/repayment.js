'use strict';
module.exports = (sequelize, DataTypes) => {
  var Repayment = sequelize.define('Repayment', {
    faspay_payment_id: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  Repayment.associate = function(models) {
    // associations can be defined here
  };
  return Repayment;
};