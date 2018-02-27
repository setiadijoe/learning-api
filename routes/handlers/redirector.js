const { FASPAY_RESPONSE_CODE } = require('../../helpers/constant')
const inquiry = require('./inquiry');

const redirector = (request, h) => {
  if ( request.query.type === 'inquiry') {
    return inquiry(request, h)
  } else if ( request.query.type === 'payment') {
    return 'payment'
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
