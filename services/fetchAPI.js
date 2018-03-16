require('dotenv').config()

const axios = require('axios')

async function requestToken() {
  return axios({
    method: 'post',
    url: `${process.env.URL}/signin-by-key`,
    headers: {
      'Authorization': `Key ${process.env.PUBLIC_KEY}.${process.env.PRIVATE_KEY}`
    }
  }).then(({data}) => data.token)
}

async function requestAmount(loanId, token) {
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
  let url= null
  if (vaDetail.source === 'LenderAccount') {
    payload.notes = 'top up via VA'
    url = `${process.env.URL}/account/lender/${vaDetail.lender_account_id}/topup`
  } else {
    payload.notes = 'repayment via VA'
    payload.payment_date = moment()
    url = `${process.env.URL}/loan/${loanId}/repayment`
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

module.exports = {
  requestToken,
  requestAmount,
  paymentToAdminService
}
