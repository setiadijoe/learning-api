'use strict'
const td = require('testdouble')
const inquiry = require('../../services/inquiry')
const fetchAPI = require('../../services/fetchAPI')

describe('Inquiry Service', () => {
  test('get transaction as borrower (LoanAccount)', (done) => {
    const vadetail = {
      loan_id: 5,
      lender_account_id: null,
      source: 'LoanAccount',
      virtual_account_id: 12345
    }
    const amount = 89000
    const mockedAmount = td.function()
    td.replace(fetchAPI, 'requestToken', () => {
      return 'token'
    })

    td.replace(fetchAPI, 'requestAmount', (loan_id, token) => {
      if (loan_id === 5 && token === 'token') {
        return Promise.resolve(amount)
      } 
    })
    
    inquiry.getTransactionAmount(vadetail).then(data => {
      expect(data).toEqual(amount)
      done()
    })
  })

  test('get Transaction Amount as Lender (LenderAccount)', () => {
    const vadetail = {
      lender_account_id: 4,
      loan_id: null,
      virtual_account_id: '12345',
      source: 'LenderAccount'
    }

    td.replace(fetchAPI, 'requestToken', () => {
      return 'token'
    })

    td.replace(fetchAPI, 'requestAmount', (lender_account_id, token) => {
      if (lender_account_id === 4 && token === 'token') {
        return Promise.resolve(0)
      } 
    })
    return inquiry.getTransactionAmount(vadetail).then(amount => {
      expect(amount).toEqual(0)
    })
  })

  test('get Transaction amount failed (from admin-service)', () => {
    const vadetail = {
      loan_id: 5,
      lender_account_id: null,
      source: 'LoanAccount',
      virtual_account_id: '12345'
    }

    td.replace(fetchAPI, 'requestToken', () => {
      return Promise.reject(new Error())
    })

    return inquiry.getTransactionAmount(vadetail).catch(err => {
      expect(err).toEqual(new Error('Cannot request to API!'))
    })
  })

  test(`Test when identifier not Loan Account and Lender Account`, (done) => {
    const vadetail = {
      loan_id: 5,
      lender_account_id: null,
      source: 'LoanAccounts',
      virtual_account_id: '12345'
    }

    inquiry.getTransactionAmount(vadetail).catch(err => {
      expect(err).toEqual(new Error('invalid account identifier'))
      done()
    })
  })
})