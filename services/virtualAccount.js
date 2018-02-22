const Model = require('./../models')

module.exports.create = (virtualAccounts) => {
  return Model.VirtualAccount.bulkCreate(virtualAccounts)
}
