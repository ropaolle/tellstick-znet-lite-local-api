'use strict'

const { experiment, it } = (exports.lab = require('lab').script())
const { expect } = require('code')

const { tellstickApi, setAccessToken } = require('../src/tellstick/proxy')

experiment('tellstick/proxy.js', () => {
  it('setAccessToken', async () => {
    expect(setAccessToken('dummykey')).to.equal('dummykey')
  })

  it('tellstickApi token/new', async () => {
    const result = await tellstickApi({ type: 'token', command: 'new' })
    expect(result.error).to.exist()
  })

  it('tellstickApi token/access', async () => {
    const result = await tellstickApi({ type: 'token', command: 'access' })
    expect(result.success).to.exist()
  })

  it('tellstickApi token/access with token', async () => {
    const result = await tellstickApi({ type: 'token', command: 'access', requestToken: 'dummy' })
    expect(result.error).to.exist()
  })

  it('tellstickApi devices', async () => {
    const result = await tellstickApi({ type: 'devices' })
    expect(result.error).to.exist()
  })
})
