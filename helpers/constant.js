require('dotenv').config()

module.exports.FASPAY_RESPONSE_CODE = {
  Sukses: '00',
  Gagal: '01'
}

module.exports.FASPAY_USER_LOGIN = {
  USER_ID: process.env.FASPAY_USERID || '16393',
  PASSWORD: process.env.FASPAY_PASSWORD || 'ezthBeOIHz5fsvi'
}

module.exports.IDENTIFIER = {
  'LenderAccount': '1',
  'LoanAccount': '2'
}
