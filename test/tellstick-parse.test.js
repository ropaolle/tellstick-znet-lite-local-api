'use strict'

const { experiment, it } = (exports.lab = require('lab').script())
const { expect } = require('code')

const tellstick = require('../src/tellstick-parse')

experiment('tellstick-parse.js', () => {
  // Basic
  it('Empty object', () => {
    const result = tellstick.parseAll({ type: '' })
    expect(result).to.be.null()
  })

  // Token
  it('Token', () => {
    const result = tellstick.parseAll({ type: 'token' })
    expect(result).to.be.null()
  })

  it('Token: new', () => {
    const result = tellstick.parseAll({ type: 'token', command: 'new' })
    expect(result).to.equal('token')
  })

  it('Token: access', () => {
    const result = tellstick.parseAll({ type: 'token', command: 'access', token: 'dummy' })
    expect(result).to.equal('token?token=dummy')
  })

  it('Token: access (no token)', () => {
    const result = tellstick.parseAll({ type: 'token', command: 'access' })
    expect(result).to.be.undefined()
  })

  it('Token: refresh', () => {
    const result = tellstick.parseAll({ type: 'token', command: 'refresh' })
    expect(result).to.equal('refreshToken')
  })

  // Sensors
  it('Sensors', () => {
    const result = tellstick.parseAll({ type: 'sensors' })
    expect(result).to.equal('sensors/list?includeValues=1')
  })

  it('Sensors: info', () => {
    const result = tellstick.parseAll({ type: 'sensors', id: 1, command: 'info' })
    expect(result).to.equal('sensor/info?id=1')
  })

  it('Sensors: unknown', () => {
    const result = tellstick.parseAll({ type: 'sensors', id: 1, command: 'unknown' })
    expect(result).to.be.null()
  })

  // Devices
  it('Devices', () => {
    const result = tellstick.parseAll({ type: 'devices' })
    expect(result).to.equal('devices/list?supportedMethods=19')
  })

  it('Devices: info', () => {
    const result = tellstick.parseAll({ type: 'devices', id: 1, command: 'info' })
    expect(result).to.equal('device/info?id=1&supportedMethods=19')
  })

  it('Devices: turnOn', () => {
    const result = tellstick.parseAll({ type: 'devices', id: 1, command: 'turnOn' })
    expect(result).to.equal('device/turnOn?id=1')
  })

  it('Devices: dim', () => {
    const result = tellstick.parseAll({ type: 'devices', id: 1, command: 'dim', level: 80 })
    expect(result).to.equal('device/dim?id=1&level=80')
  })

  it('Devices: dim (no level)', () => {
    const result = tellstick.parseAll({ type: 'devices', id: 1, command: 'dim' })
    expect(result).to.be.undefined()
  })

  it('Devices: unknown', () => {
    const result = tellstick.parseAll({ type: 'devices', id: 1, command: 'unknown' })
    expect(result).to.be.null()
  })
})
