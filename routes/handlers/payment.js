const fetchUserDetail = require('../../services/getDataVA')
const { checkSignature } = require('./../../utils/signature')
const pushPaymentRecord = require('../../services/pushPaymentRecord')
const {
  FASPAY_RESPONSE_CODE,
  FASPAY_USER_LOGIN
} = require('../../helpers/constant')

const payment = (request, h) => {

  return fetchUserDetail(request.params.VA)
  .then(user => {
    let recordPayment = {
      virtual_account: user.virtual_account_id,
      transaction_id: request.query.trx_uid,
      amount: request.query.amount,
      status: 'pending'
    }
    return pushPaymentRecord(recordPayment)
    .then(recorded => {
      return {
        faspay: {
          response: 'VA Static Response',
          va_number: recorded.virtual_account,
          amount: recorded.amount,
          cust_name: `${user.first_name} ${user.last_name}`,
          response_code: FASPAY_RESPONSE_CODE.SUCCEED
        }
      }
    })
  })
  .catch(err => {
    return {
      faspay: {
        response: 'VA Static Response',
        va_number: null,
        amount: null,
        cust_name: null,
        response_code: FASPAY_RESPONSE_CODE.FAILED
      }
    }
  })
}

module.exports = payment
