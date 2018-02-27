const { FASPAY_RESPONSE_CODE } = require('../../helpers/constant')
const payment = require('./payment')
const { inquiry } = require('./../../controllers/faspay')

const redirector = (request, h) => {
  if (request.query.type === 'inquiry') {
    return inquiry(request, h)
  } else if (request.query.type === 'payment') {
    return payment(request, h)
  }
  return {
    response: {
      response: 'VA Static Response',
      va_number: null,
      amount: null,
      cust_name: null,
      response_code: FASPAY_RESPONSE_CODE.FAILED
    }
  }
}

module.exports = redirector;
