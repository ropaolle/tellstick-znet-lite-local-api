'use strict'

// Test framework https://github.com/hapijs/lab
const { experiment, it } = (exports.lab = require('lab').script())

// Assertion https://github.com/hapijs/code/blob/master/API.md
const { expect } = require('code')

const tellstick = require('../src/tellstick-api')

experiment('tellstick-api.js', () => {
  it('CallApi token/new', async () => {
    const result = await tellstick.callApi({ type: 'token', command: 'new' })
    expect(result.success).to.exist()
  })

  it('CallApi token/access', async () => {
    const result = await tellstick.callApi({ type: 'token', command: 'access' })
    expect(result.success).to.exist()
  })
})