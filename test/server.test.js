'use strict'

const { experiment, it } = (exports.lab = require('lab').script())
const { expect } = require('code')

const server = require('../src/server')

experiment('server.js', () => {
  it('Call /version -> 200', async () => {
    await server.inject({ method: 'GET', url: '/api/v1' }).then(response => {
      expect(response.statusCode).to.equal(200)
    })
  })

  it('Call /version -> 403', async () => {
    await server.inject({ method: 'GET', url: '/api/v2' }).then(response => {
      expect(response.statusCode).to.equal(403)
    })
  })

  it('Call /init -> 200', async () => {
    await server.inject({ method: 'GET', url: '/api/v1/init' }).then(response => {
      expect(response.statusCode).to.equal(200)
    })
  })

  it('Call /favorites -> 200', async () => {
    await server.inject({ method: 'GET', url: '/api/v1/favorites/2' }).then(response => {
      expect(response.statusCode).to.equal(200)
    })
  })

  it('Call /favorites -> 200', async () => {
    await server.inject({ method: 'GET', url: '/api/v1/favorites/2' }).then(response => {
      expect(response.statusCode).to.equal(200)
    })
  })

  it('Call /token -> 200', async () => {
    await server.inject({ method: 'GET', url: '/api/v1/token?command=new' }).then(response => {
      expect(response.result.success).to.exist()
    })
  })

  it('Call /token -> 200', async () => {
    await server.inject({ method: 'GET', url: '/api/v1/token?command=refresh' }).then(response => {
      expect(response.result.success).to.exist()
    })
  })

  it('Call /token -> 200', async () => {
    await server.inject({ method: 'GET', url: '/api/v1/token?command=access' }).then(response => {
      expect(response.result.success).to.exist()
    })
  })

  it('Call /devices -> 200', async () => {
    await server.inject({ method: 'GET', url: '/api/v1/devices' }).then(response => {
      expect(response.statusCode).to.equal(200)
    })
  })
})
