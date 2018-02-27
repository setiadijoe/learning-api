const fetchUserDetail = require('../../services/getDataVA')
const fetchLoanDetails = require('../../services/getLoanDetail')
const checkSignature = require('../../utils/checkSignature')
const {
  FASPAY_RESPONSE_CODE,
  FASPAY_USER_LOGIN
} = require('../../helpers/constant')

const inquiry = (request, h) => {
  const response = {
    response: 'VA Static Response',
    va_number: null,
    amount: null,
    cust_name: null,
    response_code: FASPAY_RESPONSE_CODE.FAILED
  }

  return fetchUserDetail(request.params.VA)
  .then(user => {
    return fetchLoanDetails()
    .then(detail => {
      if (checkSignature(request.params.signature, FASPAY_USER_LOGIN.USER_ID, FASPAY_USER_LOGIN.PASSWORD, user.virtual_account_id)) {
        if (detail.account_id === user.account_id) {
          response.amount = detail.amount
          response.response_code = FASPAY_RESPONSE_CODE.SUCCEED
        } else {
          response.response_code = FASPAY_RESPONSE_CODE.FAILED
        }
        return response
      }
    })
  })
  .catch(err => {
    return response
  })
}

module.exports = inquiry;
