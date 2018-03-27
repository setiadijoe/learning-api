require('dotenv').config()
const axios = require('axios')

async function notifyToSlack (payload, channel) {
  return axios({
    method: 'post',
    url: process.env.SLACK_URL,
    data: {
      channel,
      text: '',
      data: payload
    }
  })
}

module.exports = {
  notifyToSlack
}
