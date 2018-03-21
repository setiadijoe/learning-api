'use strict'

const { hashSignature, checkSignature } = require('../../utils/signature')

test('hashType of hashSignature must be md5 and sha1', (done) => {
  expect(hashSignature('string', 'md5')).toEqual('b45cffe084dd3d20d928bee85e7b0f21')
  expect(hashSignature('string', 'sha1')).toEqual('ecb252044b5ea0f679ee78ec1a12904739e2904d')
  expect(hashSignature.bind('string', 'asdf')).toThrow()
  expect(hashSignature.bind('string', 'sha256')).toThrow()
  done()
})

test('first paramater of hashSignature must be string alphanumeric', (done) => {
  expect(hashSignature('alpha1234', 'sha1')).toEqual('138ca31030d414e4aa720e04c9617ab5dbc337bd')
  expect(hashSignature.bind(1234, 'md5')).toThrow()
  done()
})

test('function checkSignature should return true', (done) => {
  const signature = '0c51de36ec726a79af61d3ea4da38d42a7910dd2'
  const virtualAccount = '1010952511556130'
  expect(checkSignature(signature, virtualAccount)).toBeTruthy()
  done()
})
