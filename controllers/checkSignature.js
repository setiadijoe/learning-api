const hashSignature = require('../utils/hashSignature')

const checkSignature = (signature, user_id, password, va_number) => {
  const hashedSignature = hashSignature(hashSignature(`${user_id}.${password}.${va_number}`, 'md5'), 'sha1')
  if (signature !== hashedSignature) {
    throw new Error('signature is not valid')
  }
  return true
}

module.exports = checkSignature