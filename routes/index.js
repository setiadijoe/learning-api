const Joi = require('joi')
const redirector = require('./handlers/redirector')
const virtualAccount = require('./handlers/virtualAccount')
const postPayment = require('./handlers/postPayment')

const routes = {
  register: (server, options) => {
    server.route([{
      method: 'GET',
      path: '/',
      config: {
        handler: (request, h) => 'It works buddy',
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
            trx_id: Joi.string().when('type', { is: 'payment', then: Joi.required(), otherwise: Joi.invalid() }),
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
      path: '/faspay/generate',
      config: virtualAccount.generateVa
    },
    {
      method: 'POST',
      path: '/api',
      config: postPayment.pushPaymentNotif
    }
    /**
     * Output Response
     * Response : {
     *  trx_id: 789092834729348,
     *  merchant_id: 11012,
     *  bill_no: 904752475,
     *  response_code: '00',
     *  response_desc: 'Success',
     *  response_date: 2017-08-08, 11:11:45
     * }
     */
  ])
  },
  name: 'routes-plugin'
}

module.exports = routes;
