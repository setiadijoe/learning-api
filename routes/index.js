const Joi = require('joi')
const redirector = require('./handlers/redirector')
const virtualAccount = require('./handlers/virtualAccount')
const notification = require('./handlers/notification')

const routes = {
  register: (server, options) => {
    server.route([{
      method: 'GET',
      path: '/',
      config: {
        handler: async (request, h) => `OK!`,
        description: 'Root API',
        notes: 'return server status'
      }
    },
    {
      method: 'GET',
      path: '/{virtualAccount}/{signature}',
      config: {
        validate: {
          params: {
            virtualAccount: Joi.string().alphanum(),
            signature: Joi.string().token()
          },
          query: {
            type: Joi.string().valid('inquiry', 'payment'),
            trx_uid: Joi.string().when('type', { is: 'payment', then: Joi.required(), otherwise: Joi.invalid() }),
            amount: Joi.number().when('type', { is: 'payment', then: Joi.required(), otherwise: Joi.invalid() })
          }
        },
        handler: redirector,
        description: 'VA redirector',
        notes: `takes the query and redirect to specific routing
        1. Just check VA and get response just like inquiry-Endpoint
        2. Check signature and get response like inquiry-Endpoint
        3. Check query type and get response as needed`
      }
    },
    {
      method: 'POST',
      path: '/api',
      config: notification.pushPaymentNotif
    }
  ])
  },
  name: 'routes-plugin'
}

module.exports = routes;
