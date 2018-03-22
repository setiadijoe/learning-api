const Joi = require('joi')
const controller = require('./../../controllers/virtualAccount')

module.exports.generateVa = {
  handler: controller.generateVa,
  validate: {
    payload: {
      accountId: Joi.number().required(),
      accountSource: Joi.string().valid('LenderAccount', 'LoanAccount').required(),
      loanId: Joi.number().when('accountSource', { is: 'LoanAccount', then: Joi.required(), otherwise: Joi.invalid() }),
      lenderAccountId: Joi.number().when('accountSource', { is: 'LenderAccount', then: Joi.required(), otherwise: Joi.invalid() }),
      phoneNumber: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string()
    }
  },
  description: 'Generate Virtual Account.'
}
