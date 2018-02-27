const Model = require('../models')

const pushPaymentRecord = paymentRecord => {
  return Model.FaspayPayment.create({
    virtual_account: paymentRecord.virtual_account,
    transaction_id: paymentRecord.transaction_id,
    amount: paymentRecord.amount,
    status: paymentRecord.status
  })
  .then(recorded => {
    return recorded
  })
  .catch(err => {
    return err
  })
}

module.exports = pushPaymentRecord