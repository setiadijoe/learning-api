const td = require('testdouble')
const faspayController = require('./../../controllers/faspay')
const vaService = require('../../services/virtualAccount')
const inquiryService = require('../../services/inquiry')
const paymentService = require('./../../services/payment')
const signatureUtils = require('./../../utils/signature')


const dummyVa = '1031501106871919'
const dummyUser = {
  virtual_account_id: dummyVa,
  source: 'LoanAccount',
  first_name: 'john',
  last_name: 'doe'
}
const transactionAmount = '10000000'

describe('Inquiry and Payment request', () => {

  test('failed inquiry', async (done) => {
    const mockedVaDetail = td.replace(vaService, 'virtualAccountDetail')
    td.when(mockedVaDetail('1234')).thenResolve(null)

    const request = {
      params: {
        virtualAccount: '1234'
      }
    }

    const response = await faspayController.inquiry(request)
    expect(response.response_code).toEqual('01')
    done()
  })

  test('success inquiry', async (done) => {
    const mockedVaDetail = td.replace(vaService, 'virtualAccountDetail')
    td.when(mockedVaDetail(dummyVa)).thenResolve(dummyUser)

    const mockedCheckSignature = td.replace(signatureUtils, 'checkSignature', td.function())
    td.when(mockedCheckSignature('987654321', dummyVa)).thenReturn(true)

    const mockedTransactionAount = td.replace(inquiryService, 'getTransactionAmount', td.function())
    td.when(mockedTransactionAount(dummyVa, dummyUser)).thenResolve(transactionAmount)

    const request = {
      params: {
        virtualAccount: dummyVa,
        signature: '987654321'
      }
    }

    const response = await faspayController.inquiry(request)
    expect(response.response_code).toEqual('00')
    done()
  })

  test('failed payment', async (done) => {
    const mockedVaDetail = td.replace(vaService, 'virtualAccountDetail')
    td.when(mockedVaDetail(dummyVa)).thenResolve(dummyUser)

    const paymentPayload = {
      virtual_account: dummyUser.virtual_account_id,
      transaction_id: 'unique_trx_id',
      amount: '10000000',
      status: 'pending'
    }
    const mockedPaymentService = td.replace(paymentService, 'insertPayment')
    td.when(mockedPaymentService(paymentPayload)).thenResolve({
      amount: '10000000',
      virtual_account: dummyUser.virtual_account_id
    })

    const request = {
      params: {
        virtualAccount: dummyVa
      },
      query: {
        trx_uid: 'unique_trx_id',
        amount: '10000000'
      }
    }

    const res = await faspayController.payment(request)
    expect(res.va_number).toEqual(dummyUser.virtual_account_id)
    expect(res.response_code).toEqual('00')
    done()
  })
})
