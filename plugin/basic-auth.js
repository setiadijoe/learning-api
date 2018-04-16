const { compareUsernamePassword } = require('../auth/auth')

const basicAuth = {
  register: async (server, option) => {
    console.log('masuk sini gak?')
    server.auth.strategy('basic-auth', 'basic', {
      validate: compareUsernamePassword
    })

    server.auth.default('basic-auth')
  },
  name: 'basic-auth-plugin'
}

module.exports = basicAuth
