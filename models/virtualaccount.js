'use strict';
module.exports = function(sequelize, DataTypes) {
  var VirtualAccount = sequelize.define('VirtualAccount', {
    account_id: DataTypes.INTEGER,
    source: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    bank_code: DataTypes.STRING,
    virtual_account_id: DataTypes.STRING
  }, {});
  return VirtualAccount;
};
