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
      "A".id, "A".source, "A".source_id, "UD"."firstName", "UD"."lastName", "UD"."phoneNumber"
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
    WHERE NOT
      "A".id = ANY($1::int[])
  `,
  values: [arrayId]
})

const getDistinctId = async () => {
  let listId = await Model.VirtualAccount.findAll({ attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('account_id')),'account_id']]})
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
          return va
        })
      })
    })
    .then(async (virtualAccounts) => {
      await asyncForEach(virtualAccounts, async (vaAccount) => {
        console.log(`VA of ${vaAccount[0].first_name} ${vaAccount[0].last_name} is being created`)
        return await create(vaAccount)
      })
    })
    .then(() => console.log('finish'))
    .catch(err => console.log(err))
}

migrateVa()

const job = schedule.scheduleJob('* */30 * * * *', function () {
  migrateVa()
})
