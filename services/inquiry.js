const {  IDENTIFIER } = require('../helpers/constant')
const { requestToken, requestAmount } = require('../services/fetchAPI')

module.exports.getTransactionAmount = async (virtualAccount, user) => {
  const { source } = user
  const identifier = IDENTIFIER[source]

  if (!identifier) {
    return Promise.reject('invalid account identifier')
  }

  let amount = 0
  if (identifier === IDENTIFIER['LoanAccount']) {
    try {
      const token = await requestToken()
      amount = await requestAmount(user.loan_id, token)
      return amount
    } catch (e) {
      return Promise.reject(e)
    }
  }
  return Promise.resolve(amount)
}