const md5 = require('md5')
const sha1 = require('sha1')

const redirector = (request, h) => {
  // cek VA nya
  if (req.params.va === '123') {
    
  }
  
  const signature = sha1(md5(`${user_id}.${password}.${req.params.va}`))
  
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
