'use strict'

const { experiment, it } = (exports.lab = require('lab').script())
const { expect } = require('code')

const server = require('../src/server')

experiment('server.js', () => {
  it('Call /v1 (existing ver) -> 200', async () => {
    await server.inject({ method: 'GET', url: '/v1' })
      .then(response => {
        expect(response.statusCode).to.equal(200)
      })
  })

  it('Call /v2 (not existing ver) -> 404', async () => {
    await server.inject({ method: 'GET', url: '/v2' })
      .then(response => {
        expect(response.statusCode).to.equal(404)
      })
  })

  it('Call /v1/token -> 200', async () => {
    await server.inject({ method: 'GET', url: '/v1/token' })
      .then(response => {
        expect(response.result.success).to.exist()
      })
  })

  it('Call /v1/devices -> 200', async () => {
    await server.inject({ method: 'GET', url: '/v1/devices' })
      .then(response => {
        return expect(response.statusCode).to.equal(200)
      }).catch(err => {
        return expect(err).to.equal(200)
      })

    return true
  })
})
