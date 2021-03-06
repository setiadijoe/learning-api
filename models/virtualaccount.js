'use strict'
module.exports = function (sequelize, DataTypes) {
  var VirtualAccount = sequelize.define('VirtualAccount', {
    account_id: DataTypes.INTEGER,
    source: DataTypes.STRING,
    loan_id: DataTypes.INTEGER,
    lender_account_id: DataTypes.INTEGER,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    bank_code: DataTypes.STRING,
    virtual_account_id: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    getterMethods: {
      fullName () {
        return `${this.first_name} ${this.last_name || ''}`.trim()
      }
    }
  })
  return VirtualAccount
}
