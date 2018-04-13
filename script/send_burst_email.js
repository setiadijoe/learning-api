require('dotenv').config()

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
        const body = body_text
          .replace(/{{fullName}}/g, va_detail.fullName.toUpperCase())
          .replace(/{{codeBank1}}/g, va_detail.bank_code[0].toUpperCase())
          .replace(/{{vaCode1}}/g, va_detail.virtual_account_id[0])
          .replace(/{{codeBank2}}/g, va_detail.bank_code[1].toUpperCase())
          .replace(/{{vaCode2}}/g, va_detail.virtual_account_id[1])

        return client.send({
          from: 'customer@taralite.com',
          fromName: 'Taralite Admin',
          subject: 'Taralite: Notification For New Virtual Account',
          msgTo: process.env.NODE_ENV === 'production' ? [ va_detail.email ] : [ process.env.NOTIFICATION_EMAIL ],
          msgBcc: process.env.NODE_ENV === 'production' ? [ 'admin@taralite.com' ] : null,
          bodyHtml: body.replace(/\n/g, '<br>'),
          textHtml: body
        })
      })
    })
}

const body_text = `Kepada {{fullName}},

Berikut ini kami informasikan mengenai nomor virtual account yang digunakan untuk melakukan transaksi

Nama Bank: {{codeBank1}}
Nomor Virtual Account: {{vaCode1}}

Nama Bank: {{codeBank2}}
Nomor Virtual Account: {{vaCode2}}

Demikianlah informasi yang kami berikan. Jika ada yang kurang jelas harap segera hubungi kami

Terima kasih

Phone  : 0811-8181-020
Office : 021-292-00-955
Email  : customer@taralite.com`

sendBurstEmail()
