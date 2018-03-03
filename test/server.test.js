'use strict'

// Test framework https://github.com/hapijs/lab
const { experiment, it } = (exports.lab = require('lab').script())

// Assertion https://github.com/hapijs/code/blob/master/API.md
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
        expect(response.statusCode).to.equal(200)
      })
  })
})
