'use strict'

const { experiment, it } = (exports.lab = require('lab').script())
const { expect } = require('code')

const tellstick = require('../src/tellstick-api')

experiment('tellstick-api.js', () => {
  it('tellstickApi token/new', async () => {
    const result = await tellstick.tellstickApi({ type: 'token', command: 'new' })
    expect(result.success).to.exist()
  })

  it('tellstickApi token/new', async () => {
    const result = await tellstick.tellstickApi({ type: 'token', command: 'new' })
    expect(result.success).to.exist()
  })

  it('tellstickApi token/access', async () => {
    const result = await tellstick.tellstickApi({ type: 'token', command: 'access' })
    expect(result.success).to.exist()
  })

  it('tellstickApi token/access with token', async () => {
    const result = await tellstick.tellstickApi({ type: 'token', command: 'access', token: 'dummy' })
    expect(result.success).to.exist()
  })
})
