const Model = require('../models')

const fetchUserDetail = virtualaccount => {
  return Model.VirtualAccount.findOne({
    where: {
      virtual_account_id: virtualaccount
    }
  })
  .then(user => {
    return user
  })
  .catch(err => {
    return err
  })
}

module.exports = fetchUserDetail
