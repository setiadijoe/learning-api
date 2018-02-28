const Model = require('../models')

module.exports.insertPayment = data => {
  Model.FaspayPayment.create({
    virtual_account: data.virtual_account,
    transaction_id: data.transaction_id,
    amount: data.amount,
    status: data.status
  })
}

module.exports.updatePayment = (trx_id, updateObject) => {
  return Model.FaspayPayment.update(updateObject, {
    where: {
      transaction_id: trx_id
    },
    returning: true
  })
}
