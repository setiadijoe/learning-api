const db = require('../db/connection')
const { fetchAccountById } = require('../queries/loan')

module.exports.fetchAccountId = (accountId) => {
  return db.query(fetchAccountById(accountId))
  .then(fetchData => {
    return  fetchData.rows[0].loan_id
  })
  .catch(err =>{
    return err
  })
}
