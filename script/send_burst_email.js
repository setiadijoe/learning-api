require('dotenv').config()
const fs = require('fs')
const path = require('path')

const ElasticMail = require('nodelastic')
const services = require('../services/virtualAccount')

const sendBurstEmail = () => {
  return services.getAllVirtualAccountDetail()
    .then(vaDetails => {
      let seen = {}
      var virtual_accounts = vaDetails.filter((virtual_account_detail) => {
        var previousDetail

        if (seen.hasOwnProperty(virtual_account_detail.account_id)) {
          previousDetail = seen[virtual_account_detail.account_id]
          previousDetail.bank_code.push(virtual_account_detail.bank_code)
          previousDetail.virtual_account_id.push(virtual_account_detail.virtual_account_id)

          // Don't keep this virtual_account_detail, we've merged it into the previous one
          return false
        }

        if (!Array.isArray(virtual_account_detail.bank_code) || !Array.isArray(virtual_account_detail.virtual_account_id)) {
          virtual_account_detail.bank_code = [virtual_account_detail.bank_code]
          virtual_account_detail.virtual_account_id = [virtual_account_detail.virtual_account_id]
        }

        seen[virtual_account_detail.account_id] = virtual_account_detail

        return true
      })

      const client = new ElasticMail(process.env.ELASTIC_API_KEY)
      return virtual_accounts.map(va_detail => {
        const body = fs.readFileSync('./Petriq.html', 'UTF-8')
        const body_text = body.replace(/{{FNAME}}/g, va_detail.fullName.toUpperCase())

        return client.send({
          from: 'customer@taralite.com',
          fromName: 'Taralite Admin',
          subject: 'Taralite: Notification For New Virtual Account',
          msgTo: process.env.NODE_ENV === 'production' ? [ va_detail.email ] : process.env.NOTIFICATION_EMAIL.split(' '),
          msgBcc: process.env.NODE_ENV === 'production' ? [ 'admin@taralite.com' ] : null,
          bodyHtml: body_text.replace(/\n/g, '<br>'),
          textHtml: body_text
        }, attachments)
      })
    })
}

const attachments = [
  'Tata Cara Pembayaran BCA VA.pdf',
  'Tata Cara Pembayaran Permata VA.pdf'
].map(attachment => {
  return {
    data: fs.readFileSync(path.resolve(`./attachments/${attachment}`)),
    filename: attachment,
    contentType: 'application/pdf'
  }
})

sendBurstEmail()
