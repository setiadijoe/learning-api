const BANK_NAME = {
  'bca': 'BANK CENTRAL ASIA',
  'permata': 'BANK PERMATA'
}

module.exports.bank_mapper = (bank_code) => {
  return bank_code ? BANK_NAME[bank_code] : bank_code
}
