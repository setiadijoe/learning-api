const db = require('../db/connection')
const services = require('../services/virtualAccount')

const getAccountId = () => ({
  name: 'get-account-id',
  text: `
  SELECT "A".id FROM "Accounts" "A"
  INNER JOIN "LoanAccounts" "LA"
  ON "LA".id = "A".source_id AND "A".source = 'LoanAccount'
  INNER JOIN "Loans" "L"
  ON "L".id = "LA".loan_id
  WHERE "L".status = 'disbursed';
  `
})

const getAccountIdLoanDisbursed = async () => {
  const accountId = await db.query(getAccountId())
  return accountId.rows
}

const getArrayId = async () => {
  const accountId = await getAccountIdLoanDisbursed()
  const arrayId = accountId.map(account => {
    return account.id
  })
  return arrayId
}

const getVA = () => {
  return getArrayId()
    .then((account_id) => {
      return services.vaDetail(account_id)
        .then(vaDetails => {
          let seen = {}
          var virtual_accounts = vaDetails.filter((virtual_account_detail) => {
            var previousDetail

            if (seen.hasOwnProperty(virtual_account_detail.account_id)) {
              previousDetail = seen[virtual_account_detail.account_id]
              previousDetail.bank_code.push(virtual_account_detail.bank_code)
              previousDetail.virtual_account_id.push(virtual_account_detail.virtual_account_id)

              // Don't keep this virtual_account_detail, we've merged it into the previous one
              return false
            }

            if (!Array.isArray(virtual_account_detail.bank_code) || !Array.isArray(virtual_account_detail.virtual_account_id)) {
              virtual_account_detail.bank_code = [virtual_account_detail.bank_code]
              virtual_account_detail.virtual_account_id = [virtual_account_detail.virtual_account_id]
            }

            seen[virtual_account_detail.account_id] = virtual_account_detail

            return true
          })
          return virtual_accounts
        })
    })
}

module.exports = {
  getVA
}
