const Joi = require('joi')
const controller = require('./../../controllers/virtualAccount')

module.exports.generateVa = {
  handler: controller.generateVa,
  validate: {
    payload: {
      accountId: Joi.number().required(),
      accountSource: Joi.string().valid('LenderAccount', 'LoanAccount').required(),
      lenderAccountId: Joi.number(),
      phoneNumber: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string()
    }
  },
  description: 'generate VA'
}

module.exports.getVirtualAccountDetail = {
  handler: controller.getVirtualAccountDetail,
  validate: {
    query: {
      accountId: Joi.string(),
      loanId: Joi.number(),
      lenderAccountId: Joi.number()
    }
  },
  description: 'fetch Virtual Account using accountId, or loanId, or lenderAccountId'
}
