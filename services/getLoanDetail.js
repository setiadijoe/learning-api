const axios = require('axios')

const db = axios.create({
  baseURL: 'http://localhost:3000'
})

const fetchLoanDetails = () => {
  return db.get('/loanDetails')
  .then(({ data }) => {
    return data
  })
  .catch(err => {
    return err
  })
}

module.exports = fetchLoanDetails;