require('dotenv').config()

const ElasticMail = require('nodelastic')
const services = require('../services/virtualAccount')
const moment = require('moment')
const Model = require('../models')
const nunjucks = require('nunjucks')
const money = require('./../utils/money').money
nunjucks.configure('./email-template/', { autoescape: false })

module.exports.getNotificationDetails = (transaction_id) => {
  return Model.FaspayPayment.find({ where: { transaction_id } })
    .then(payment => {
      return services.virtualAccountDetail(payment.virtual_account)
        .then(vaDetail => {
          const { amount, transaction_date } = payment
          const { email, fullName } = vaDetail
          return {
            amount, email, fullName, transaction_date
          }
        })
    })
}

module.exports.generateNotificationEmail = ({ fullName, amount, transaction_date }) => {
  const day = moment(transaction_date).locale('id').format('dddd')
  const date = moment(transaction_date).locale('id').format('DD MMMM YYYY')
  const time = moment(transaction_date).locale('id').format('hh:mm:ss')
  const formattedAmount = money(amount)
  return nunjucks.render('payment-receipt.html', { fullName, amount: formattedAmount, day, date, time })
}

module.exports.notifyPaymentReceived = (payment_transaction_id) => {
  return this.getNotificationDetails(payment_transaction_id)
    .then(details => {
      const html = this.generateNotificationEmail(details)
      const client = new ElasticMail(process.env.ELASTIC_API_KEY)
      if (process.env.NODE_ENV !== 'production') console.log(`Sending to ${process.env.NOTIFICATION_EMAIL} instead of ${details.email}`)

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

// const email_text = `Kepada {{fullName}},

// Transaksi anda dengan nomor
// Virtual Account = {{virtualAccountId}}
// pada tanggal {{transactionDate}} telah berhasil
// Berikut detail pinjaman yang sudah terbayarkan

// - No Transaksi: {{transactionId}}
// - No Billing: {{billNo}}
// - Total Pembayaran: {{amount}}
// - Status Pembayaran: {{statusdesc}}
// - Tanggal Transaksi: {{transactionDate}}

// Demikianlah informasi yang kami berikan. Jika ada yang kurang jelas harap segera hubungi kami

// Terima kasih

// Phone  : 0811-8181-020
// Office : 021-292-00-955
// Email  : customer@taralite.com`
