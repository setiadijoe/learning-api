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
    const array_of_status = payment.PaymentTransactions.map(payment => {
      return payment.status === 'success'
    })
    var status

    array_of_status.indexOf(true) === -1 ? status = 'failed' : status = 'success'
    if (payment.status_code === '2' && status === 'success') return Promise.reject(new Error('Cannot update payment with status success'))
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
