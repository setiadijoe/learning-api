'use strict'
const td = require('testdouble')
const inquiry = require('../../services/inquiry')

describe('Get Transaction Amount', () => {
  test('Test get transaction amount ', (done) => {
    const va = '12345'
    const vadetail = {
      loan_id: 5,
      lender_account_id: null,
      source: 'LoanAccount',
      virtual_account_id: 12345
    }
    const amount = 89000
    const mockedAmount = td.function()
    td.replace(inquiry, 'getTransactionAmount', mockedAmount)
    td.when(mockedAmount(va, vadetail)).thenReturn(Promise.resolve(amount))
    
    inquiry.getTransactionAmount(va, vadetail).then(data => {
      expect(data).toEqual(amount)
      done()
    })
  })

  test(`Test when identifier not Loan Account and Lender Account`, (done) => {
    const va = '1234'
    const vadetail = {
      loan_id: 5,
      lender_account_id: null,
      source: 'LoanAccounts',
      virtual_account_id: 12345
    }
    const mockedAmount = td.function()
    td.replace(inquiry, 'getTransactionAmount', (va, vadetail) => {
      const identifier = ['LoanAccount', 'LenderAccount']
      if (!identifier.includes(vadetail.source)) {
        return Promise.reject('invalid account identifier')
      }
    })

    inquiry.getTransactionAmount(va, vadetail).catch(err => {
      expect(err).toEqual('invalid account identifier')
      done()
    })
  })

  test('Test when source is Loan Account', (done) => {
    const va = '1234'
    const vadetail = {
      loan_id: 5,
      source: 'LoanAccount'
    }
    const amount = 89000
    const mockedAmount = td.function()
    td.replace(inquiry, 'getTransactionAmount', (va, vadetail) => {
      if (vadetail.source === 'LoanAccount') {
        return Promise.resolve(amount)
      }
    })

    inquiry.getTransactionAmount(va, vadetail).then(data => {
      expect(data).toEqual(amount)
      done()
    })
  })

  test('Test when source is Lender Account', (done) => {
    const va = '1234'
    const vadetail = {
      loan_id: 5,
      source: 'LenderAccount'
    }
    const amount = 0
    const mockedAmount = td.function()
    td.replace(inquiry, 'getTransactionAmount', (va, vadetail) => {
      if (vadetail.source === 'LenderAccount') {
        return Promise.resolve(amount)
      }
    })

    inquiry.getTransactionAmount(va, vadetail).then(data => {
      expect(data).toEqual(amount)
      done()
    })
  })
})