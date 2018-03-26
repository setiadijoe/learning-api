require('dotenv').config()
const axios = require('axios')

async function notifyForPayment (payload) {
  return axios({
    method: 'post',
    url: process.env.SLACK_URL,
    data: {
      channel: '#faspay-payment',
      text: '',
      data: payload
    }
  })
}

async function notifyForTopup (payload) {
  return axios({
    method: 'post',
    url: process.env.SLACK_URL,
    data: {
      channel: '#faspay-topup',
      text: '',
      data: payload
    }
  })
}

module.exports = {
  notifyForPayment,
  notifyForTopup
}
