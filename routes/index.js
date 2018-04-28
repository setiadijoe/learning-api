const notification = require('./handlers/notification')
const virtualAccount = require('./handlers/virtualAccount')
const { inquiry } = require('./handlers/inquiry')

const routes = {
  register: (server, options) => {
    server.route([{
      method: 'GET',
      path: '/',
      config: {
        handler: async (request, h) => `OK!!`,
        description: 'Root API',
        auth: false,
        notes: 'return server status'
      }
    },
    {
      method: 'GET',
      path: '/{virtualAccount}/{signature}',
      config: inquiry
    },
    {
      method: 'GET',
      path: '/virtualAccountDetail',
      config: virtualAccount.getVirtualAccountDetail
    },
    {
      method: 'POST',
      path: '/api',
      config: notification.pushPaymentNotif
    }, {
      method: 'POST',
      path: '/va/generate',
      config: virtualAccount.generateVa
    }
    ])
  },
  name: 'routes-plugin'
}

module.exports = routes
