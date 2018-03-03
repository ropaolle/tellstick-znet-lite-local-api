'use strict'

const { expect } = require('code')
const { it } = (exports.lab = require('lab').script())

const tellstick = require('../src/tellstick-api')

it('returns true when 1 + 1 equals 2', async () => {
  const r = await tellstick.callApi({ type: 'token', command: 'new' })
  console.log('IT', r)
  expect(1 + 1).to.equal(2)
})

it('returns true when 1 + 1 equals 2', async () => {
  const r = await tellstick.callApi({ type: 'token', command: 'refresh' })
  console.log('IT', r)
  expect(1 + 1).to.equal(2)
})

it('returns true when 1 + 1 equals 2', async () => {
  const r = await tellstick.callApi({ type: 'token', command: 'new' })
})
it('returns true when 1 + 1 equals 2', async () => {
  const r = await tellstick.callApi({ type: 'token', command: 'access' })
})
