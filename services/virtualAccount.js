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

module.exports.vaDetail = (accountId, loanId, lenderAccountId) => {
  const whereQuery = {}
  if (accountId) whereQuery['account_id'] = accountId
  if (loanId) whereQuery['loan_id'] = loanId
  if (lenderAccountId) whereQuery['lender_account_id'] = lenderAccountId
  return Model.VirtualAccount.findAll({
    where: whereQuery
  })
}

module.exports.getAllVirtualAccountDetail = () => {
  return Model.VirtualAccount.findAll()
}
