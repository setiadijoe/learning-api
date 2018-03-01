const Boom = require('boom')
const { fetchAccountId } = require('../services/getLoanDetail')
const { checkSignature } = require('../utils/signature')
const { FASPAY_RESPONSE_CODE } = require('../helpers/constant')
const { virtualAccountDetail } = require('../services/virtualAccount')
const { insertPayment, updatePayment } = require('../services/payment')
const { requestToken, requestAmount } = require('../services/fetchAPI')

module.exports.inquiry = async (request, h) => {
  const response = {
    response: 'VA Static Response',
    va_number: null,
    amount: null,
    cust_name: null,
    response_code: FASPAY_RESPONSE_CODE.FAILED
  }

  const user = await virtualAccountDetail(request.params.virtualAccount)
  if (user) {
    const loan_id = await fetchAccountId(user.account_id)
    let token
    if (checkSignature(request.params.signature, user.virtual_account_id)) {
      if (!token) {
        token = await requestToken()
      }
      const amount = await requestAmount(loan_id, token)
      response.va_number = user.virtual_account_id
      response.amount = amount
      response.cust_name = `${user.first_name} ${user.last_name}`
      response.response_code = FASPAY_RESPONSE_CODE.SUCCEED
      return response
    } else {
      return response
    }
  } else {
    return response
  }
}

module.exports.payment = async (request, h) => {
  const user = await virtualAccountDetail(request.params.virtualAccount)
  if (user) {
    let recordPayment = {
      virtual_account: user.virtual_account_id,
      transaction_id: request.query.trx_id,
      amount: request.query.amount,
      status: 'pending'
    }
    const recorded = await insertPayment(recordPayment)
    return {
      faspay: {
        response: 'VA Static Response',
        va_number: recorded.virtual_account,
        amount: recorded.amount,
        cust_name: `${user.first_name} ${user.last_name}`,
        response_code: FASPAY_RESPONSE_CODE.SUCCEED
      }
    }
  } else {
    return {
      faspay: {
        response: 'VA Static Response',
        va_number: null,
        amount: null,
        cust_name: null,
        response_code: FASPAY_RESPONSE_CODE.FAILED
      }
    }
  }
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
