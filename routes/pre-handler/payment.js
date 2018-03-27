require('dotenv').config()
const Boom = require('boom')
const signatureUtils = require('../../utils/signature')

module.exports.checkSignature = (r, h) => {
  const { virtualAccount, signature } = r.params
  if (signatureUtils.checkSignature(signature, virtualAccount)) {
    return true
  }
  console.log('Your Signature is Invalid')
  return Boom.badRequest('Your Signature is Invalid!!')
}
