'use strict'

const { expect } = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()
const { experiment, it } = lab

const server = require('../src/server')

experiment('server.js', () => {
  lab.before(() => {
    return server.start().then(/* () => (console.log'Test server started!') */)
  })

  it('Call / -> 200', async () => {
    await server.inject({ method: 'GET', url: '/' }).then(response => {
      expect(response.statusCode).to.equal(404)
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
