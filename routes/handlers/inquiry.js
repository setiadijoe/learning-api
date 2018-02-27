const fetchUserDetail = require('../../services/getDataVA')
const fetchLoanDetails = require('../../services/getLoanDetail')
const checkSignature = require('../../controllers/checkSignature')
const {
  FASPAY_RESPONSE_CODE,
  FASPAY_USER_LOGIN
} = require('../../helpers/constant')

const inquiry = (request, h) => {
  // cek VA nya

  return fetchUserDetail(request.params.VA)
  .then(user => {
    return fetchLoanDetails()
    .then(detail => {
      let result = null
      let response_code = null
      if (checkSignature(request.params.signature, FASPAY_USER_LOGIN.USER_ID, FASPAY_USER_LOGIN.PASSWORD, user.virtual_account_id)) {
        if (detail.id === user.loan_id) {
          result = detail.amount
          response_code = FASPAY_RESPONSE_CODE.SUCCEED
        } else {
          response_code = FASPAY_RESPONSE_CODE.FAILED
        }
        return {
          response: {
            response: 'VA Static Response',
            va_number: user.virtual_account_id,
            amount: result,
            cust_name: `${user.first_name} ${user.last_name}`,
            response_code: response_code
          }
        }
      }
    })
  })
  .catch(err => {
    return {
      response: {
        response: 'VA Static Response',
        va_number: null,
        amount: null,
        cust_name: null,
        response_code: FASPAY_RESPONSE_CODE.FAILED
      }
    }
  })
}

module.exports = inquiry;