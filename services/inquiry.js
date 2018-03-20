const { IDENTIFIER } = require('../helpers/constant')
const fetchApi = require('../services/fetchAPI')

module.exports.getTransactionAmount = async (accountDetail) => {
  const { source } = accountDetail
  const identifier = IDENTIFIER[source]

  if (!identifier) {
    return Promise.reject(new Error('invalid account identifier'))
  }

  let amount = 0
  if (identifier === IDENTIFIER['LoanAccount']) {
    try {
      const token = await fetchApi.requestToken()
      amount = await fetchApi.requestAmount(accountDetail.loan_id, token)
      return amount
    } catch (e) {
      return Promise.reject(new Error('Cannot request to API!'))
    }
  }
  return Promise.resolve(amount)
}
