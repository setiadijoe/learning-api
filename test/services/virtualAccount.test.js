'use strict'
const td = require('testdouble')

const vaService = require('../../services/virtualAccount')

describe('Virtual Account Detail', () => {
  test('Test to get existing detail of virtual account', (done) => {
    const va = '1031502139121551'
    const mockedVADetail = td.function()
    td.replace(vaService, 'virtualAccountDetail', mockedVADetail)
    td.when( mockedVADetail(va) ).thenReturn(Promise.resolve({
      loan_id: 1,
      virtual_account_id: va,
      lender_account_id: null,
      source: 'LoanAccount',
      first_name: 'Husni',
      last_name: 'Patrick',
      bank_code: 'BCA'
    }))

    vaService.virtualAccountDetail(va).then(data => {
      expect(data.virtual_account_id).toEqual(va)
      expect(data.loan_id).toEqual(1)
      done()
    })
  })

  test(`Test when virtual account doesn't exist`, (done) => {
    const va = '12345'
    const mockedVADetail = td.function()
    td.replace(vaService, 'virtualAccountDetail', mockedVADetail)
    td.when( mockedVADetail(va) ).thenReject({
      error: 'Invalid Virtual Account'
    })

    vaService.virtualAccountDetail(va).catch(err => {
      expect(err).toEqual({error: 'Invalid Virtual Account'})
      done()
    })
  })
})

