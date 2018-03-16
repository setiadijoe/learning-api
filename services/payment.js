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

async function getVirtualAccountDetail (virtual_account) {
  return Model.VirtualAccount.findOne({
    where: {
      virtual_account_id: virtual_account
    }
  })
  .then((data) => {
    return data
  })
  .catch(err => {
    return err
  })
} 

async function getPaymentDetail (transaction_id) {
  return Model.FaspayPayment.findOne({
    where: {
      transaction_id: transaction_id
    }, include: [
      {
        model: Model.Repayment
      }
    ]
  })
  .then(paymentDetail => {
    return paymentDetail
  })
  .catch(err => {
    console.error(err)
    return err
  })
}

async function insertPaymentTransaction (payment_id, status) {
  return Model.PaymentTransaction.create({
    faspay_payment_id: payment_id,
    status: status
  }).then(data => data)
  .catch(err => err)
}

module.exports = {
  insertPayment,
  updatePayment,
  getVirtualAccountDetail,
  getPaymentDetail,
  insertPaymentTransaction
}