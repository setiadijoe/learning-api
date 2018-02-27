const Model = require('./../models')

module.exports.create = (virtualAccounts) => {
  return Model.VirtualAccount.bulkCreate(virtualAccounts)
}

module.exports.virtualAccountDetail = virtualAccount => {
  return Model.VirtualAccount.findOne({
    where: {
      virtual_account_id: virtualAccount
    }
  })
}
