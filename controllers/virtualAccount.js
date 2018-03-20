const Boom = require('boom')
const services = require('./../services/virtualAccount')
const util = require('./../utils/virtualAccount')

module.exports.generateVa = (request, h) => {
  const { accountId, accountSource, phoneNumber, firstName, lastName } = request.payload

  const virtualAccounts = util.generateVa(accountId, accountSource, phoneNumber)
  virtualAccounts.map(virtualAccount => {
    virtualAccount.first_name = firstName
    virtualAccount.last_name = lastName
  })

  return services.create(virtualAccounts)
    .catch((err) => {
      return Boom.badData(new Error(err))
    })
}
