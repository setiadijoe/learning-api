const crypto = require('crypto')

const hashSignature = (string, hashType) => {
  return crypto.createHash(hashType).update(string).digest('hex')
}

module.exports = hashSignature