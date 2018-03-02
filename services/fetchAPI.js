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
  let today = new Date()
  return axios({
    method: 'get',
    url: `${process.env.URL}/loan/${loanId}/repayment/outstandingAmount?date=${today}`,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(({data}) => data.data.amount)
}

module.exports = {
  requestToken,
  requestAmount
}