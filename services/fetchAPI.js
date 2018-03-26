require('dotenv').config()
const moment = require('moment')
const axios = require('axios')

async function requestToken () {
  return axios({
    method: 'post',
    url: `${process.env.URL}/signin-by-key`,
    headers: {
      'Authorization': `Key ${process.env.PUBLIC_KEY}.${process.env.PRIVATE_KEY}`
    }
  }).then(({data}) => data.token)
}

async function requestAmount (loanId, token) {
  return axios({
    method: 'get',
    url: `${process.env.URL}/loan/${loanId}/repayment/nextRepaymentAmount`,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(({data}) => data.data.amount)
}

async function paymentToAdminService (vaDetail, payload) {
  const token = await requestToken()
  let url = null
  if (vaDetail.source === 'LenderAccount') {
    payload.notes = `top up via VA bank ${vaDetail.bank_code}`
    url = `${process.env.URL}/account/lender/${vaDetail.lender_account_id}/topup`
  } else {
    payload.notes = `repayment via VA bank ${vaDetail.bank_code}`
    payload.payment_date = moment()
    url = `${process.env.URL}/loan/${vaDetail.loan_id}/repayment`
  }
  return axios({
    method: 'post',
    url,
    data: payload,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

async function notifyToSlack (payload) {
  return axios({
    method: 'post',
    url: process.env.SLACK_URL,
    data: {
      channel: '#faspay-notification',
      text: '',
      data: payload
    }
  })
}

module.exports = {
  requestToken,
  requestAmount,
  paymentToAdminService,
  notifyToSlack
}
