const crypto = require('crypto')
const { FASPAY_USER_LOGIN } = require('../helpers/constant')

module.exports.hashSignature = (string, hashType) => {
  return crypto.createHash(hashType).update(string).digest('hex')
}

module.exports.checkSignature = (signature, va_number) => {
  const userId = FASPAY_USER_LOGIN.USER_ID
  const password = FASPAY_USER_LOGIN.PASSWORD

  const hashedSignature = this.hashSignature(this.hashSignature(`${userId}.${password}.${va_number}`, 'md5'), 'sha1')
  return signature !== hashedSignature ? false : true
}
