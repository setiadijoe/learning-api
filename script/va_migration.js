const db = require('../db/connection')
const { generateVa } = require('./../utils/virtualAccount')
const { create } = require('./../services/virtualAccount')

const getAllLoanDetail = () => ({
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

const getAllLenderDetail = () => ({
  name: 'get-lender-account',
  text: `
  SELECT 
    "A".id, "A".source, "A".source_id, "LA".id AS "lender_account_id", "Detail"."firstName", "Detail"."lastName", "Detail"."phoneNumber" 
  FROM 
    "Accounts" "A"
  INNER JOIN 
    "LenderAccounts" "LA" 
  ON 
    "LA".id = "A"."source_id" AND "A".source = 'LenderAccount'
  INNER JOIN 
    "User" 
  ON 
    "User".id = "LA"."user_id"
  INNER JOIN (
    SELECT 
      "userId", 'individual'::varchar AS userType, "firstName", "lastName", npwp, details, "phoneNumber"
    FROM 
      "UserDetailIndividual"
    UNION SELECT 
      "userId", 'institutional'::varchar AS userType, "companyName" AS "firstName", NULL as "lastName", npwp, details, "phoneNumber" 
    FROM 
    "UserDetailInstitutionals"
  ) "Detail" 
  ON 
    "User"."userType" = "Detail".userType AND "User".id = "Detail"."userId";
  `
})

const getLenderDetail = async () => {
  lenderAccount = await db.query(getAllLenderDetail())
  return lenderAccount.rows
}

const getLoanDetail = async () => {
  loanDetail = await db.query(getAllLoanDetail())
  return loanDetail.rows
}

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const migrateLoan = async () => {
  getLoanDetail()
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

const migrateLender = async () => {
  getLenderDetail()
  .then(lenders => {
    return lenders.map(lender => {
      const lenderVa = generateVa(lender.id, lender.source, lender.phoneNumber)
      return lenderVa.map(va => {
        va.first_name = lender.first_name
        va.last_name = lender.last_name
        va.lender_account_id = lender.lender_account_id
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

migrateLoan()
migrateLender()