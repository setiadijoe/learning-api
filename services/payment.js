const Model = require('../models')

async function insertPayment (data) {
  return Model.FaspayPayment.create({
    virtual_account: data.virtual_account,
    transaction_id: data.transaction_id,
    amount: data.amount,
    status: data.status
  })
}

async function updatePayment (trx_id, updateObject) {
  return Model.FaspayPayment.findOne({
    where: {
      transaction_id: trx_id
    },
    include: [{model: Model.PaymentTransaction}]
  }).then(payment => {
    if (!payment) return Promise.reject(new Error('Transaction Id Not Found!'))
    if (payment.status_code === '2') return Promise.reject(new Error('Cannot update payment with status_code = 2!!'))
    return payment.updateAttributes(updateObject)
  })
}

async function insertPaymentTransaction (payment_id, status) {
  return Model.PaymentTransaction.create({
    faspay_payment_id: payment_id,
    status: status
  })
}

module.exports = {
  insertPayment,
  updatePayment,
  insertPaymentTransaction
}
