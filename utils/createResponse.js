const { FASPAY_RESPONSE_CODE } = require('../helpers/constant')

module.exports.createResponse = (response, user) => {
  response.va_number = user.virtual_account_id
  response.amount = 0
  response.cust_name = `${user.first_name} ${user.last_name}`
  response.response_code = FASPAY_RESPONSE_CODE.Sukses
  return response
}