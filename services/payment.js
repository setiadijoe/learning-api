const Model = require('../models')

async function insertPayment (data) {
  return Model.FaspayPayment.create({
    virtual_account: data.virtual_account,
    transaction_id: data.transaction_id,
    amount: data.amount,
    status: data.status
  }).then(data => data)
}

async function updatePayment (trx_id, updateObject) {
  return Model.FaspayPayment.update(updateObject, {
    where: {
      transaction_id: trx_id
    },
    returning: true
  }).then(data => data)
}

module.exports = {
  insertPayment,
  updatePayment
}