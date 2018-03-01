require('dotenv').config()

const bankPrefix = {
  'permata': process.env.PREFIX_PERMATA || '555555',
  'bca': process.env.PREFIX_BCA || '666666'
}

const identifier = {
  'LenderAccount': '1',
  'LoanAccount': '2'
}

module.exports.generateVa = (accountId, accountSource, phoneNumber) => {
  let virtualAccounts = []

  Object.keys(bankPrefix).forEach(bank => {
    const prefix = bankPrefix[bank]
    const primaryVa = prefix + identifier[accountSource] + accountId
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
