const Boom = require('boom')
const services = require('./../services/virtualAccount')
const util = require('./../utils/virtualAccount')

module.exports.generateVa = (request, h) => {
  const { accountId, accountSource, phoneNumber, firstName, lastName, loanId, lenderAccountId } = request.payload

  const virtualAccounts = util.generateVa(accountId, accountSource, phoneNumber)
  virtualAccounts.map(virtualAccount => {
    virtualAccount.first_name = firstName
    virtualAccount.last_name = lastName
    virtualAccount.loan_id = loanId
    virtualAccount.lender_account_id = lenderAccountId
  })

  return services.create(virtualAccounts)
    .then((vaAccounts) => {
      const newVaAccounts = vaAccounts.map((va) => va.get({ plain: true }))
      newVaAccounts.map((va) => {
        delete va.id
        delete va.createdAt
        delete va.updatedAt
      })
      return newVaAccounts
    })
    .catch((err) => {
      console.log(err)
      return Boom.badData(new Error(err))
    })
}

module.exports.getVirtualAccountDetail = (request, h) => {
  const { accountId, loanId, lenderAccountId } = request.query
  if (!accountId && !loanId && !lenderAccountId) {
    return Boom.badRequest('Need at least 1 query!!')
  }
  return services.vaDetail(accountId, loanId, lenderAccountId)
}
