const db = require('../db/connection')
const { generateVa } = require('./../utils/virtualAccount')
const { create } = require('./../services/virtualAccount')

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

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }

const migrateLender = async () => {
  getLenderDetail()
  .then(lenders => {
    return lenders.map(lender => {
      const lenderVa = generateVa(lender.id, lender.source, lender.phoneNumber)
      return lenderVa.map(va => {
        va.first_name = lender.firstName
        va.last_name = lender.lastName
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

migrateLender()