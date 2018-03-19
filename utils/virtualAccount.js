require('dotenv').config()
const { IDENTIFIER } = require('./../helpers/constant')

const bankPrefix = {
  'permata': process.env.PREFIX_PERMATA,
  'bca': process.env.PREFIX_BCA
}

module.exports.generateVa = (accountId, accountSource, phoneNumber) => {
  let virtualAccounts = []

  Object.keys(bankPrefix).forEach(bank => {
    const prefix = bankPrefix[bank]
    const primaryVa = prefix + IDENTIFIER[accountSource] + accountId
    const additionalVa = phoneNumber.slice(primaryVa.length - 16)

    const virtualAccount = primaryVa + additionalVa
    virtualAccounts.push({
      virtual_account_id: virtualAccount,
      account_id: accountId,
      source: accountSource,
      bank_code: bank
    })
  })

  return virtualAccounts
}
