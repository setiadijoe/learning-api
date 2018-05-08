const Boom = require('boom')
const moment = require('moment-timezone')
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
  const account = await vaService.virtualAccountDetail(request.params.virtualAccount)
  if (!account) return response

  if (request.query.type === 'inquiry') {
    try {
      const amount = await inquiry.getTransactionAmount(account)
      Object.assign(response, {
        va_number: account.virtual_account_id,
        amount: Math.ceil(amount), // ceiling the amount because faspay will ignore the decimal value.
        cust_name: account.fullName,
        response_code: FASPAY_RESPONSE_CODE.Sukses })
      return response
    } catch (e) {
      console.error(e)
      return response
    }
  }
  if (request.query.type === 'payment') {
    const recordPayment = {
      virtual_account: account.virtual_account_id,
      transaction_id: request.query.trx_uid,
      amount: request.query.amount,
      status: 'pending'
    }
    try {
      const recorded = await paymentService.insertPayment(recordPayment)
      return Object.assign(response, {
        va_number: recorded.virtual_account,
        amount: recorded.amount,
        cust_name: account.fullName,
        response_code: FASPAY_RESPONSE_CODE.Sukses
      })
    } catch (e) {
      console.error(e)
      return Boom.badData('Something wrong has happened! Please try again or contact us!')
    }
  }
}

module.exports.paymentNotif = async (r, h) => {
  const { request, trx_id, merchant_id, bill_no, payment_date, amount, payment_status_code, payment_status_desc } = r.payload
  const responseObject = {
    response: request,
    merchant_id,
    bill_no,
    amount,
    status_code: FASPAY_RESPONSE_CODE.Sukses,
    status_desc: 'Sukses',
    transaction_date: moment().tz('Asia/Jakarta')
  }

  try {
    console.log(`updating payment trx_id = ${trx_id} with status code = ${payment_status_code}`)
    const payment = await updatePayment(trx_id, {
      merchant_id,
      bill_no,
      amount,
      status_code: payment_status_code,
      status_desc: payment_status_desc,
      transaction_date: moment(payment_date).utcOffset(+'-7').format('YYYY-MM-DD HH:mm:ss') // faspay payment date is in UTC+7 timezone while admin service is using UTC
    })

    if (payment.status_code === '2') { // Check Faspay Documentation
      const vaDetail = await vaService.virtualAccountDetail(payment.virtual_account)
      const payload = {
        amount: payment.amount,
        payment_date: moment(payment_date).utcOffset(+'-7').format('YYYY-MM-DD HH:mm:ss').toString()
      }
      console.log('payment dari FASPAY : ', payment_date)
      console.log('UTC TIME            : ', payload.payment_date)
      let status = 'failed'
      try {
        console.log('sending payment to admin service')
        await paymentToAdminService(vaDetail, payload)
        status = 'success'
      } catch (e) {
        console.error('Error in admin service')
        console.error(e)
      }
      await insertPaymentTransaction(payment.id, status)
      const slackPayload = {
        virtual_account_id: payment.virtual_account,
        amount: payment.amount,
        status,
        bank_name: vaDetail.bank_code.toUpperCase(),
        date: moment().tz('Asia/Jakarta')
      }

      // status === 'success' && sendEmailUsingVirtualAccount(payment)
      if (vaDetail.loan_id) {
        notifyToSlack(Object.assign(slackPayload, { loan_id: vaDetail.loan_id }), '#faspay-repayment')
      } else if (vaDetail.lender_account_id) {
        notifyToSlack(Object.assign(slackPayload, { name: vaDetail.fullName }), '#faspay-topup')
      }
    }
    return responseObject
  } catch (e) {
    console.error(e)
    return Object.assign(responseObject, {
      response_code: FASPAY_RESPONSE_CODE.Gagal,
      response_desc: 'Gagal'
    })
  }
}
