const Boom = require('boom')
const fetchLoanDetails = require('../services/getLoanDetail')
const { checkSignature } = require('../utils/signature')
const { FASPAY_RESPONSE_CODE } = require('../helpers/constant')
const { virtualAccountDetail } = require('../services/virtualAccount')
const { insertPayment, updatePayment } = require('../services/payment')

module.exports.inquiry = (request, h) => {
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

module.exports.payment = (request, h) => {
  return fetchUserDetail(request.params.virtualAccount)
  .then(user => {
    let recordPayment = {
      virtual_account: user.virtual_account_id,
      transaction_id: request.query.trx_uid,
      amount: request.query.amount,
      status: 'pending'
    }
    return insertPayment(recordPayment)
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

module.exports.paymentNotif = (request, h) => {
  const { request_type, trx_id, merchant_id, bill_no, amount, payment_status_code, payment_status_desc, signature } = request.payload
  const updateObject = {
    merchant_id,
    bill_no,
    amount,
    status_code: payment_status_code,
    status_desc: payment_status_desc
  }

  if (checkSignature(signature, `${bill_no}.${payment_status_code}`)) {
    return updatePayment(trx_id, updateObject)
      .then((updateResponse) => {
        if (!updateResponse[0]) {
          return Boom.badData('NO FIELDS UPDATED')
        }
        return {
          response: request_type,
          trx_id: updateResponse[1][0].transaction_id,
          merchant_id: updateResponse[1][0].merchant_id,
          bill_no: updateResponse[1][0].bill_no,
          response_code: updateResponse[1][0].status_code,
          response_desc: updateResponse[1][0].status_desc,
          response_date: updateResponse[1][0].updatedAt
        }
      })
      .catch(err => {
        return Boom.badData(new Error(err))
      })
  } else {
    return Boom.badRequest('YOUR SIGNATURE IS INVALID')
  }
}
