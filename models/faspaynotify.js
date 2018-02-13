'use strict';
module.exports = function(sequelize, DataTypes) {
  var FaspayNotify = sequelize.define('FaspayNotify', {
    transaction_id: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    status_code: DataTypes.INTEGER,
    status_desc: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return FaspayNotify;
};