require('dotenv').config()
const Boom = require('boom')
const signatureUtils = require('../../utils/signature')

module.exports.checkSignature = (r, h) => {
  const { bill_no, payment_status_code, signature } = r.payload
  if (signatureUtils.checkSignature(signature, `${bill_no}${payment_status_code}`)) {
    return true
  }
  console.error('Your Signature is Invalid')
  return Boom.badRequest('Your Signature is Invalid!!')
}
