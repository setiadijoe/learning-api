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

async function sendRepayment (loanId, payload) {
  return axios({
    method: 'post',
    url: `/loan/${loanId}/repayment`,
    data: payload
  }).then(({data}) => {
    console.log(data)
    return data
  })
  .catch(err => {
    console.log(err)
    return err
  })
}

module.exports = {
  requestToken,
  requestAmount,
  sendRepayment
}
