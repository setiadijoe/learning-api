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
    }
  }).then(payment => {
    if (!payment) return Promise.reject(new Error('Transaction Id Not Found!'))
    return payment.updateAttributes(updateObject)
  })
}

async function getVirtualAccountDetail (virtual_account) {
  return Model.VirtualAccount.findOne({
    where: {
      virtual_account_id: virtual_account
    }
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
  getVirtualAccountDetail,
  insertPaymentTransaction
}
