const db = require('../db/connection')
const { generateVa } = require('./../utils/virtualAccount')
const { create } = require('./../services/virtualAccount')
const Sequelize = require('sequelize')
const Model = require('./../models')
const schedule = require('node-schedule')

const getIdNotHaveVA = (arrayId) => ({
  name: 'Id-not-have-VA',
  text: `
  SELECT
  "A".id, "A".source, "Detail"."firstName", "Detail"."lastName", "Detail"."phoneNumber", "SourceAccount".loan_id, "SourceAccount".id as source_id
FROM
  "Accounts" as "A"
INNER JOIN
(
  SELECT
    'LoanAccount' AS type, "LoanA".id, loan_id, "U".id AS "user_id"
  FROM
    "LoanAccounts" "LoanA"
  INNER JOIN
    "Loans" "L"
  ON
    "L".id = "LoanA".loan_id
  INNER JOIN
    "LoanProposals" "LP"
  ON
    "LP".id = "L".proposal_id
  INNER JOIN
    "BorrowerEntities" "BE"
  ON
    "BE".id = "LP".borrower_entity_id
  INNER JOIN
    "User" "U"
  ON
    "U".id = "BE".user_id
  UNION
  SELECT
    'LenderAccount' as type, "LenderA".id, NULL AS loan_id, "LenderA".user_id
  FROM
    "LenderAccounts" "LenderA"
  INNER JOIN
    "User" "U"
  ON
  "U".id = "LenderA".user_id
) "SourceAccount"
ON ("A".source_id = "SourceAccount".id and "SourceAccount".type = "A".source)
INNER JOIN (
  SELECT
    "userId", 'individual'::varchar AS userType, "firstName", "lastName", "phoneNumber"
  FROM
    "UserDetailIndividual"
  UNION SELECT
    "userId", 'institutional'::varchar AS userType, "companyName" AS "firstName", NULL as "lastName", "phoneNumber"
  FROM
  "UserDetailInstitutionals"
) "Detail"
ON
  "SourceAccount".user_id = "Detail"."userId"
    WHERE NOT
      "A".id = ANY($1::int[])
  `,
  values: [arrayId]
})

const getDistinctId = async () => {
  let listId = await Model.VirtualAccount.findAll({ attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('account_id')), 'account_id']] })
  return listId.map(account => account.account_id)
}

const getAccountIdList = async () => {
  let listId = await getDistinctId()
  let result = await db.query(getIdNotHaveVA(listId))
  return result.rows
}

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const migrateVa = async () => {
  getAccountIdList()
    .then((accounts) => {
      console.log('VA THAT WILL BE CREATED', accounts.length)
      return accounts.map(account => {
        const accountVa = generateVa(account.id, account.source, account.phoneNumber)
        return accountVa.map(va => {
          va.first_name = account.firstName
          va.last_name = account.lastName
          va.loan_id = account.source === 'LoanAccount' ? account.loan_id : null
          va.lender_account_id = account.source === 'LenderAccount' ? account.source_id : null
          return va
        })
      })
    })
    .then(async (virtualAccounts) => {
      await asyncForEach(virtualAccounts, async (vaAccount) => {
        console.log(`VA of ${vaAccount[0].first_name} ${vaAccount[0].last_name} is being created`)
        const createdVa = await create(vaAccount)
        return createdVa
      })
    })
    .then(() => console.log('finish'))
    .catch(err => console.log(err))
}

const job = schedule.scheduleJob('* */30 * * * *', function () { // eslint-disable-line no-unused-vars
  migrateVa()
})
