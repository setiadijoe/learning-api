const db = require('../db/connection')
const { fetchLoanById } = require('../queries/loan')

module.exports.fetchLoanId = (accountId) => {
  return db.query(fetchLoanById(accountId))
  .then(fetchData => {
    return  fetchData.rows[0].loan_id
  })
  .catch(err =>{
    return err
  })
}
