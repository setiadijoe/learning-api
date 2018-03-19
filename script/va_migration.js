const db = require('../db/connection')
const { generateVa } = require('./../utils/virtualAccount')
const { create } = require('./../services/virtualAccount')

const getAllAccountDetail = () => ({
  name: 'get-account-detail',
  text: `
 SELECT
   "A".id, "A".source, "A".source_id, "LA"."loan_id", "UD"."firstName",  "UD"."lastName", "UD"."phoneNumber"
 FROM
   "Accounts" as "A"
 INNER JOIN
   "LoanAccounts" as "LA"
 ON
   "LA".id = "A".source_id AND "A".source = 'LoanAccount'
 INNER JOIN
   "Loans" as "L"
 ON
   "L".id = "LA".loan_id
 INNER JOIN
   "LoanProposals" as "LP"
 ON
   "LP".id = "L".proposal_id
 INNER JOIN
   "BorrowerEntities" as "BE"
 ON
   "BE".id = "LP".borrower_entity_id
 INNER JOIN
   "User" as "U"
 ON
   "U".id = "BE".user_id
 INNER JOIN
   "UserDetailIndividual" as "UD"
 ON
   "UD"."userId" = "U".id
 `
})

const getAccountDetail = async () => {
  accountDetail = await db.query(getAllAccountDetail())
  return accountDetail.rows
}

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const migrateVa = async () => {
  getAccountDetail()
    .then((accounts) => {
      return accounts.map(account => {
        const accountVa = generateVa(account.id, account.source, account.phoneNumber)
        return accountVa.map(va => {
          va.first_name = account.firstName
          va.last_name = account.lastName
          va.loan_id = account.loan_id
          return va
        })
      })
    })
    .then(async (virtualAccounts) => {
      await asyncForEach(virtualAccounts, async (vaAccount) => {
        return await create(vaAccount)
      })
    })
    .then(() => console.log('finish'))
    .catch(err => console.log(err))
}

migrateVa()