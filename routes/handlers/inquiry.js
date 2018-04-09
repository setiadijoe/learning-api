// const { FASPAY_RESPONSE_CODE } = require('../../helpers/constant')
const Joi = require('joi')
const preHandler = require('../pre-handler/payment')
const { inquiry } = require('./../../controllers/faspay')

module.exports.inquiry = {
  pre: [
    { method: preHandler.checkSignature }
  ],
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
  handler: inquiry,
  description: 'VA redirector',
  notes: `takes the query and redirect to specific routing
  1. Just check VA and get response just like inquiry-Endpoint
  2. Check signature and get response like inquiry-Endpoint
  3. Check query type and get response as needed`
}
