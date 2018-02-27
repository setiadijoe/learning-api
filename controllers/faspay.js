const fetchLoanDetails = require('../services/getLoanDetail')
const { checkSignature } = require('../utils/signature')
const { FASPAY_RESPONSE_CODE } = require('../helpers/constant')
const { virtualAccountDetail } = require('./../services/virtualAccount')

module.exports.inquiry = (reques, h) => {
  const response = {
    response: 'VA Static Response',
    va_number: null,
    amount: null,
    cust_name: null,
    response_code: FASPAY_RESPONSE_CODE.FAILED
  }

  return virtualAccountDetail(request.params.virtualAccount)
  .then(user => {
    if (user) {
      return fetchLoanDetails()
      .then(detail => {
        if (checkSignature(request.params.signature, user.virtual_account_id)) {
          if (detail.account_id === user.account_id) {
            response.amount = detail.amount
            response.response_code = FASPAY_RESPONSE_CODE.SUCCEED
          } else {
            response.response_code = FASPAY_RESPONSE_CODE.FAILED
          }
          return response
        }
      })
    }
    return response
  })
  .catch(err => {
    return response
  })
}
