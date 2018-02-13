'use strict';
module.exports = function(sequelize, DataTypes) {
  var FaspayInquiry = sequelize.define('FaspayInquiry', {
    date: DataTypes.DATE,
    virtual_account: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return FaspayInquiry;
};