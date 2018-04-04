require('dotenv').config()

const bankPrefix = {
  'permata': process.env.PREFIX_PERMATA,
  'bca': process.env.PREFIX_BCA
}

module.exports.generateVa = (accountId, accountSource) => {
  if (!accountId || !accountSource) {
    throw new Error()
  }
  let virtualAccounts = []
  const additionalVa = Math.random().toString().slice(2, 12)
  Object.keys(bankPrefix).forEach(bank => {
    const prefix = bankPrefix[bank]

    const virtualAccount = prefix + additionalVa
    virtualAccounts.push({
      virtual_account_id: virtualAccount,
      account_id: accountId,
      source: accountSource,
      bank_code: bank
    })
  })

  return virtualAccounts
}
