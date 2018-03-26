const Boom = require('boom')
const moment = require('moment')
const signatureUtils = require('../utils/signature')
const { FASPAY_RESPONSE_CODE } = require('../helpers/constant')
const vaService = require('../services/virtualAccount')
const { updatePayment, insertPaymentTransaction } = require('../services/payment')
const paymentService = require('./../services/payment')
const { paymentToAdminService } = require('../services/fetchAPI')
const inquiry = require('../services/inquiry')
const { notifyToSlack } = require('../services/notification')

module.exports.inquiry = async (request, h) => {
  let response = {
    response: 'VA Static Response',
    va_number: null,
    amount: null,
    cust_name: null,
    response_code: FASPAY_RESPONSE_CODE.Gagal
  }
  const user = await vaService.virtualAccountDetail(request.params.virtualAccount)
  if (user) {
    if (signatureUtils.checkSignature(request.params.signature, user.virtual_account_id)) {
      try {
        const amount = await inquiry.getTransactionAmount(user)
        response.va_number = user.virtual_account_id
        response.amount = Math.ceil(amount)
        response.cust_name = user.last_name === null ? `${user.first_name}` : `${user.first_name} ${user.last_name}`
        response.response_code = FASPAY_RESPONSE_CODE.Sukses
        return response
      } catch (e) {
        console.log(e)
        return response
      }
    }
  }
  return response
}

module.exports.payment = async (request, h) => {
  const user = await vaService.virtualAccountDetail(request.params.virtualAccount)
  if (user) {
    let recordPayment = {
      virtual_account: user.virtual_account_id,
      transaction_id: request.query.trx_uid,
      amount: request.query.amount,
      status: 'pending'
    }
    try {
      const recorded = await paymentService.insertPayment(recordPayment)
      return {
        response: 'VA Static Response',
        va_number: recorded.virtual_account,
        amount: recorded.amount,
        cust_name: user.last_name === null ? `${user.first_name}` : `${user.first_name} ${user.last_name}`,
        response_code: FASPAY_RESPONSE_CODE.Sukses
      }
    } catch (e) {
      return Boom.badData('Duplicate Transaction Id')
    }
  } else {
    return {
      response: 'VA Static Response',
      va_number: null,
      amount: null,
      cust_name: null,
      response_code: FASPAY_RESPONSE_CODE.Gagal
    }
  }
}

module.exports.paymentNotif = async (r, h) => {
  const { request, trx_id, merchant_id, bill_no, payment_date, amount, payment_status_code, payment_status_desc, signature } = r.payload
  const updateObject = {
    merchant_id,
    bill_no,
    amount,
    status_code: payment_status_code,
    status_desc: payment_status_desc,
    transaction_date: moment(payment_date).utcOffset('-0700').format('YYYY-MM-DD HH:mm:ss')
  }

  if (signatureUtils.checkSignature(signature, `${bill_no}${payment_status_code}`)) {
    try {
      const payment = await updatePayment(trx_id, updateObject)
      if (payment.status_code === '2') {
        const vaDetail = await vaService.virtualAccountDetail(payment.virtual_account)
        const payload = {
          amount: payment.amount
        }

        let paymentResult = null
        try {
          paymentResult = await paymentToAdminService(vaDetail, payload)
        } catch (e) {
          console.log('error when sending to admin service, please check to admin-service!!')
          paymentResult = { status: 500 }
        }

        const status_code = paymentResult.status === 200 ? 'success' : 'failed'
        await insertPaymentTransaction(payment.id, status_code)
        const slackPayload = {
          virtual_account_id: payment.virtual_account,
          amount: payment.amount,
          status: status_code,
          bank_name: vaDetail.bank_code.toUpperCase(),
          date: moment()
        }
        notifyToSlack(vaDetail.loan_id, slackPayload)
        return {
          response: request,
          trx_id,
          merchant_id,
          bill_no,
          response_code: FASPAY_RESPONSE_CODE.Sukses,
          response_desc: Object.keys(FASPAY_RESPONSE_CODE)[0],
          response_date: moment()
        }
      } else {
        return {
          response: request,
          trx_id,
          merchant_id,
          bill_no,
          response_code: FASPAY_RESPONSE_CODE.Sukses,
          response_desc: Object.keys(FASPAY_RESPONSE_CODE)[0],
          response_date: moment()
        }
      }
    } catch (e) {
      console.log(e)
      return {
        response: request,
        trx_id,
        merchant_id,
        bill_no,
        response_code: FASPAY_RESPONSE_CODE.Gagal,
        response_desc: Object.keys(FASPAY_RESPONSE_CODE)[1],
        response_date: moment()
      }
    }
  } else {
    console.log('Your Signature is not valid!!')
    return {
      response: request,
      trx_id,
      merchant_id,
      bill_no,
      response_code: FASPAY_RESPONSE_CODE.Gagal,
      response_desc: Object.keys(FASPAY_RESPONSE_CODE)[1],
      response_date: moment()
    }
  }
}
