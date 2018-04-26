require('dotenv').config()
const fs = require('fs')
const path = require('path')

const ElasticMail = require('nodelastic')
const get_account_id = require('./get_account_id')

const sendBurstEmail = () => {
  return get_account_id.getVA()
    .then(vaDetails => {
      const client = new ElasticMail(process.env.ELASTIC_API_KEY)
      return vaDetails.map(va_detail => {
        const body = fs.readFileSync('./Mail_template.html', 'UTF-8')
        const body_text = body.replace(/{{FNAME}}/g, va_detail.fullName.toUpperCase())
          .replace(/{{VACODE1}}/g, va_detail.virtual_account_id[1])
          .replace(/{{VACODE2}}/g, va_detail.virtual_account_id[0])

        return client.send({
          from: 'customer@taralite.com',
          fromName: 'Taralite Admin',
          subject: 'Taralite: Notification For New Virtual Account',
          msgTo: process.env.NODE_ENV === 'production' ? [ va_detail.email ] : process.env.NOTIFICATION_EMAIL,
          msgBcc: process.env.NODE_ENV === 'production' ? [ 'admin@taralite.com' ] : null,
          bodyHtml: body_text,
          textHtml: body_text
        }, attachments)
          .then(console.log)
          .catch(console.error)
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
