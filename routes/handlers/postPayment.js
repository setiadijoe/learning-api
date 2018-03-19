require('dotenv').config()
const Joi = require('joi')
const { paymentNotif } = require('../../controllers/faspay')

module.exports.pushPaymentNotif = {
  handler: paymentNotif,
  validate: {
    payload: {
      request: Joi.string().required(),
      trx_id: Joi.string().alphanum().required(), 
      merchant_id: Joi.number().required().valid(process.env.MERCHANT_ID),
      merchant: Joi.string().required().valid(process.env.MERCHANT_NAME),
      bill_no: Joi.string().alphanum().required(),
      payment_reff: Joi.string().alphanum(),
      payment_date: Joi.date().iso().required(),
      payment_status_code: Joi.string().valid('0', '1', '2', '3', '4', '5', '7', '8', '9').required(),
      payment_status_desc: Joi.string().required(),
      amount: Joi.number().required(),
      signature: Joi.string().token().required()
    }
  },
  description: 'get notification of payment'
}