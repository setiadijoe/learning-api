require('dotenv').config()
const fs = require('fs')
const path = require('path')

const ElasticMail = require('nodelastic')
const get_account_id = require('./get_virtual_account_detail')
const { bank_mapper } = require('./../utils/bank_mapper')

const sendBurstEmail = () => {
  return get_account_id.getVirtualAccountDetail()
    .then(vaDetails => {
      const email_lists = blasterEmail.map(email => {
        return email.split(',')[0].split('"').join('')
      })
      return {email_lists, vaDetails}
    })
    .then(({email_lists, vaDetails}) => {
      const client = new ElasticMail(process.env.ELASTIC_API_KEY)
      const totalEmail = vaDetails.length
      console.log(`total email: ${totalEmail}`)
      return vaDetails.map((va_detail, idx) => {
        const body = fs.readFileSync('./Mail_Template.html', 'UTF-8')
        const body_text = body.replace(/{{FNAME}}/g, va_detail.fullName.toUpperCase())
          .replace(/{{BANKCODE1}}/g, bank_mapper(va_detail.bank_code_1))
          .replace(/{{BANKCODE2}}/g, bank_mapper(va_detail.bank_code_2))
          .replace(/{{VACODE1}}/g, va_detail.virtual_account_1)
          .replace(/{{VACODE2}}/g, va_detail.virtual_account_2)

        setTimeout(() => {
          if (email_lists.indexOf(va_detail.email) !== -1) {
            console.log('Email that has been sent ', va_detail.email)
            return false
          }
          return client.send({
            from: 'customer@taralite.com',
            fromName: 'Taralite Admin',
            subject: 'Taralite: Notification For New Virtual Account',
            msgTo: process.env.NODE_ENV === 'production' ? va_detail.email : process.env.NOTIFICATION_EMAIL,
            bodyHtml: body_text,
            textHtml: body_text
          }, attachments)
            .then(console.log)
            .catch(console.error)
        }, 400 * idx)
      })
    })
}

const blasterEmail = fs.readFileSync('./LogsEmailBlast.csv', 'utf-8').split('\n').slice(1)
const attachments = [
  'Tata Cara Pembayaran VA.pdf'
].map(attachment => {
  return {
    data: fs.readFileSync(path.resolve(`./attachments/${attachment}`)),
    filename: attachment,
    contentType: 'application/pdf'
  }
})

sendBurstEmail()
