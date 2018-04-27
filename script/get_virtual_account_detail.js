const db = require('../db/connection')
const Model = require('../models')

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
  return accountId.rows.map(account => {
    return account.id
  })
}

const select_query = (account_id) => {
  return `SELECT CONCAT("BCA".first_name, ' ',
  "BCA".last_name)::VARCHAR AS "fullName",
   "BCA".account_id AS account_id,
"BCA".bank_code AS bank_code_1,
"BCA".virtual_account_id AS virtual_account_1,
"PERMATA".bank_code AS bank_code_2, 
"PERMATA".virtual_account_id AS virtual_account_2 FROM (
SELECT * FROM "VirtualAccounts" WHERE bank_code = 'bca'
) AS "BCA"
INNER JOIN (
SELECT * FROM "VirtualAccounts" WHERE bank_code = 'permata'
) AS "PERMATA" ON 
"BCA".account_id = "PERMATA".account_id
WHERE "BCA".account_id IN (${account_id});`
}

const getVirtualAccountDetail = () => {
  return getAccountIdLoanDisbursed()
    .then(account_id => {
      return Model.sequelize.query(select_query(account_id))
    })
    .then(([va_detail]) => {
      return va_detail
    })
}

module.exports = {
  getVirtualAccountDetail
}
