require('dotenv').config()

const ElasticMail = require('nodelastic')
const services = require('./virtualAccount')
const moment = require('moment')
const Model = require('../models')
const nunjucks = require('nunjucks')
const { money } = require('./../utils/money')
const { bank_mapper } = require('./../utils/bank_mapper')
nunjucks.configure('./email-template/', { autoescape: false })

module.exports.getNotificationDetails = (transaction_id) => {
  return Model.FaspayPayment.find({ where: { transaction_id } })
    .then(payment => {
      return services.virtualAccountDetail(payment.virtual_account)
        .then(vaDetail => {
          const { amount, transaction_date } = payment
          const { email, fullName, bank_code, virtual_account_id } = vaDetail
          return {
            amount, email, bank_code, fullName, virtual_account_id, transaction_date
          }
        })
    })
}

module.exports.generateNotificationEmail = ({ fullName, virtual_account_id, bank_code, amount, transaction_date }) => {
  const day = moment(transaction_date).locale('id').format('dddd')
  const date = moment(transaction_date).locale('id').format('DD MMMM YYYY')
  const time = moment(transaction_date).locale('id').tz('Asia/Jakarta').format('HH:mm:ss')
  const details = {
    fullName,
    virtualAccountId: virtual_account_id,
    bankName: bank_mapper(bank_code),
    amount: money(amount),
    day,
    date,
    time
  }
  console.log(details)
  return nunjucks.render('payment-receipt.html', details)
}

module.exports.notifyPaymentReceived = (payment_transaction_id) => {
  return this.getNotificationDetails(payment_transaction_id)
    .then(details => {
      const html = this.generateNotificationEmail(details)
      const client = new ElasticMail(process.env.ELASTIC_API_KEY)
      if (process.env.NODE_ENV !== 'production') console.log(`Sending to ${process.env.NOTIFICATION_EMAIL} instead of ${details.email}`)
      console.log(`Sending payment receipt email to ${details.email}`)
      return client.send({
        from: 'customer@taralite.com',
        fromName: 'Taralite Admin',
        subject: 'Taralite: Notifikasi Pembayaran Invoice',
        msgTo: process.env.NODE_ENV === 'production' ? [ details.email ] : [ process.env.NOTIFICATION_EMAIL ],
        msgBcc: process.env.NODE_ENV === 'production' ? [ 'admin@taralite.com' ] : null,
        bodyHtml: html
      })
    })
}
