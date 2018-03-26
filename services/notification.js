require('dotenv').config()
const axios = require('axios')

async function notifyToSlack (loan_id, payload) {
  let channelSlack = null
  if (loan_id) {
    channelSlack = '#faspay-repayment'
    payload.loan_id = loan_id
  } else {
    channelSlack = '#faspay-topup'
  }
  return axios({
    method: 'post',
    url: process.env.SLACK_URL,
    data: {
      channel: channelSlack,
      text: '',
      data: payload
    }
  })
}

module.exports = {
  notifyToSlack
}
