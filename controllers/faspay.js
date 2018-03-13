const Boom = require('boom')
const { fetchAccountId } = require('../services/getLoanDetail')
const { checkSignature } = require('../utils/signature')
const { FASPAY_RESPONSE_CODE } = require('../helpers/constant')
const { virtualAccountDetail } = require('../services/virtualAccount')
const { insertPayment, updatePayment, getLoanId, insertRepayment, getPaymentDetail } = require('../services/payment')
const { requestToken, requestAmount, sendRepayment } = require('../services/fetchAPI')

module.exports.inquiry = async (request, h) => {
  const response = {
    response: 'VA Static Response',
    va_number: null,
    amount: null,
    cust_name: null,
    response_code: FASPAY_RESPONSE_CODE.Gagal
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
      response.response_code = FASPAY_RESPONSE_CODE.Sukses
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
      transaction_id: request.query.trx_uid,
      amount: request.query.amount,
      status: 'pending'
    }
    const recorded = await insertPayment(recordPayment)
    return {
        response: 'VA Static Response',
        va_number: recorded.virtual_account,
        amount: recorded.amount,
        cust_name: `${user.first_name} ${user.last_name}`,
        response_code: FASPAY_RESPONSE_CODE.Sukses
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
    transaction_date: payment_date 
  }

  if (checkSignature(signature, `${bill_no}${payment_status_code}`)) {
    const updateResponse = await updatePayment(trx_id, updateObject)
    if (!updateResponse[0]) {
      return Boom.badData('NO FIELDS UPDATED')
    } else if (updateResponse[1][0].status_code === '2') {
      const loan_id = await getLoanId(updateResponse[1][0].virtual_account)
      const payload = {
        amount : updateResponse[1][0].amount,
        payment_date: updateResponse[1][0].transaction_date,
        notes: updateResponse[1][0].status_desc
      }
      try {
        const paymentDetail = await getPaymentDetail(trx_id)
      
        if (paymentDetail && !paymentDetail.Repayment) {
          const token = await requestToken()
          const result = await sendRepayment(loan_id, token, payload)
          const status_desc = result.status === 200 ? 'success' : 'failed'
          const status_insert = await insertRepayment(paymentDetail.id, status_desc)
          
          return {
            response: request,
            trx_id: updateResponse[1][0].transaction_id,
            merchant_id: updateResponse[1][0].merchant_id,
            bill_no: updateResponse[1][0].bill_no,
            response_code: FASPAY_RESPONSE_CODE.Sukses,
            response_desc: Object.keys(FASPAY_RESPONSE_CODE)[0],
            response_date: updateResponse[1][0].updatedAt
          }
        }
      } catch (error) {
        console.log(error)
        return Boom.badImplementation('Internal Server Error!')
      }

      return Boom.badData()
    } else {
      return {
        response: request,
        trx_id: updateResponse[1][0].transaction_id,
        merchant_id: updateResponse[1][0].merchant_id,
        bill_no: updateResponse[1][0].bill_no,
        response_code: FASPAY_RESPONSE_CODE.Gagal,
        response_desc: Object.keys(FASPAY_RESPONSE_CODE)[1],
        response_date: updateResponse[1][0].updatedAt
      }
    }
  } else {
    return Boom.badRequest('YOUR SIGNATURE IS INVALID')
  }
}
