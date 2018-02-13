const crypto = require('crypto')

const hashSignature = (string, hashType) => {
  return crypto.createHash(hashType).update(string).digest('hex')
}

const redirector = (request, h) => {
  // cek VA nya
  if (req.params.va === '123') {
    
  }
  
  const signature = hashSignature(hashSignature(`${user_id}.${password}.${req.params.va }`, 'md5'), 'sha1')

  // cek signature nya
  if (req.params.signature === signature) {
    
  }
  
  // kalo oke keduanya, cek query nya, terus redirect ke file yang diperlukan
  if (req.query.type.type === 'inquiry') {
    // redirect ke inquiry
  }
  else {
    // redirect ke payment
  }
}

module.exports = redirector;
