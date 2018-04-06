require('dotenv').config()

const ElasticMail = require('nodelastic')
const services = require('../services/virtualAccount')

module.exports.sendEmailUsingVirtualAccount = (payment) => {
  return services.virtualAccountDetail(payment.virtual_account)
    .then(vaDetail => {
      const client = new ElasticMail(process.env.ELASTIC_API_KEY)
      const body = email_text
        .replace(/{{fullName}}/g, vaDetail.fullName)
        .replace(/{{transactionId}}/g, payment.transaction_id)
        .replace(/{{virtualAccountId}}/g, vaDetail.virtual_account_id)
        .replace(/{{transactionDate}}/g, payment.transaction_date)
        .replace(/{{billNo}}/g, payment.bill_no)
        .replace(/{{amount}}/g, payment.amount)
        .replace(/{{statusdesc}}/g, payment.status_desc)

      return client.send({
        from: 'customer@taralite.com',
        fromName: 'Taralite Admin',
        subject: 'Taralite: Notifikasi Pembayaran Invoice',
        msgTo: process.env.NODE_ENV === 'production' ? [ process.env.NOTIFICATION_EMAIL ] : [ vaDetail.email ],
        msgBcc: process.env.NODE_ENV === 'production' ? null : [ 'admin@taralite.com' ],
        bodyHtml: body.replace(/\n/g, '<br>'),
        textHtml: body
      })
    })
}

const email_text = `Kepada {{fullName}},

Transaksi anda dengan nomor
Virtual Account = {{virtualAccountId}}
pada tanggal {{transactionDate}} telah berhasil
Berikut detail pinjaman yang sudah terbayarkan

- No Transaksi: {{transactionId}}
- No Billing: {{billNo}}
- Total Pembayaran: {{amount}}
- Status Pembayaran: {{statusdesc}}
- Tanggal Transaksi: {{transactionDate}}

Demikianlah informasi yang kami berikan. Jika ada yang kurang jelas harap segera hubungi kami

Terima kasih

Phone  : 0811-8181-020
Office : 021-292-00-955
Email  : customer@taralite.com`
