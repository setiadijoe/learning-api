const Boom = require('boom')
const services = require('./../services/virtualAccount')
const util = require('./../utils/virtualAccount')

module.exports.generateVa = (request, h) => {
  const { accountId, accountSource, firstName, lastName, loanId, lenderAccountId, email } = request.payload

  const virtualAccounts = util.generateVa(accountId, accountSource)
  virtualAccounts.map(virtualAccount => {
    virtualAccount.first_name = firstName
    virtualAccount.last_name = lastName
    virtualAccount.loan_id = loanId
    virtualAccount.lender_account_id = lenderAccountId
    virtualAccount.email = email
  })

  return services.vaDetail(accountId)
    .then((vaDetail) => {
      if (vaDetail && vaDetail.length) {
        return vaDetail.map(account => {
          return {
            fullName: account.fullName,
            bankCode: account.bank_code.toUpperCase(),
            virtualAccountId: account.virtual_account_id
          }
        })
      }
      return util.withRetry(services.create.bind(null, virtualAccounts), 5)
        .then(vaAccounts => {
          return vaAccounts.map(account => {
            return {
              fullName: account.fullName,
              bankCode: account.bank_code.toUpperCase(),
              virtualAccountId: account.virtual_account_id
            }
          })
        })
    })
    .catch((err) => {
      console.error(err)
      return Boom.badData(new Error(err))
    })
}

module.exports.getVirtualAccountDetail = async (request, h) => {
  const { accountId, loanId, lenderAccountId } = request.query
  if (!accountId && !loanId && !lenderAccountId) {
    return Boom.badRequest('Need at least 1 query!!')
  }
  try {
    const virtualAccounts = await services.vaDetail(accountId, loanId, lenderAccountId)
    return virtualAccounts.map((va) => ({
      accountId: va.account_id,
      fullName: va.fullName,
      virtualAccountId: va.virtual_account_id,
      bankCode: va.bank_code.toUpperCase()
    }))
  } catch (e) {
    console.error(e)
    return e
  }
}
