'use strict'

const { generateVa } = require('../../utils/virtualAccount')

const accountId = 12345
const accountSource = 'LoanAccount'
const phoneNumber = '0813434787834'

test('generateVa should have three input', (done) => {
  expect(generateVa.bind(accountId)).toThrow()
  expect(generateVa.bind(accountSource)).toThrow()
  done()
})

test('generateVa should return array', (done) => {
  expect(generateVa(accountId, accountSource)).toHaveLength(2)
  expect(generateVa(accountId, accountSource)).toBeDefined()
  done()
})
