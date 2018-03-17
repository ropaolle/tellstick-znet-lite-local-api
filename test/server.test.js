'use strict'

const { expect } = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()
const { experiment, it } = lab

const jsonDb = require('../src/utils/database')
const hapiServer = require('../src/utils/server')

let server

const DEFAULT_DB = {
  port: 4000,
  app: {
    favorites: [3, 4],
    maxMin: {},
    'authUrl': 'a',
    'requestToken': 'b',
    'expires': 666,
    'accessToken': 'c',
    'allowRenew': false
  },
  history: {
    '1521281680108': [
      {
        'temp': '26.8'
      }
    ]
  }
}

lab.before(async () => {
  const db = await jsonDb.init('./test/database.test.json', DEFAULT_DB).catch((err) => console.log('Error', err))
  server = await hapiServer.start(db)
})

lab.after(async () => {
  await hapiServer.stop()
})

experiment('server.js', () => {
  it('Call /api/v1/ping - valid api verion', async () => {
    const response = await server.inject({ method: 'GET', url: '/api/v1/ping' })
    expect(response.result.message).to.equal('pong')
  })

  it('Call /api/v1/ping - invalid api version', async () => {
    const response = await server.inject({ method: 'GET', url: '/api/v2/ping' })
    expect(response.statusCode).to.equal(404)
  })

  it('Call /api/v1/devices -> 200', async () => {
    const response = await server.inject({ method: 'GET', url: '/api/v1/devices' })
    expect(response.result.error).to.exist()
  })

  it('Call /api/v1/devices/1 -> 200', async () => {
    const response = await server.inject({ method: 'GET', url: '/api/v1/devices/1' })
    expect(response.result.error).to.equal('Unknown command!')
  })

  it('Call /api/v1/devices/1?command=info -> 200', async () => {
    const response = await server.inject({ method: 'GET', url: '/api/v1/devices/1?command=info' })
    expect(response.result.error).to.exist()
  })

  it('Call /api/v1/favorites/3 -> 200', async () => {
    const response = await server.inject({ method: 'GET', url: '/api/v1/favorites/3' })
    expect(response.result.favorites).to.equal([4])
  })

  it('Call /api/v1/favorites/100 -> 200', async () => {
    const response = await server.inject({ method: 'GET', url: '/api/v1/favorites/100' })
    expect(response.result.favorites).to.equal([4, 100])
  })

  it('Call /api/v1/token -> 200', async () => {
    const response = await server.inject({ method: 'GET', url: '/api/v1/token' })
    expect(response.result.error).to.equal('Unknown command!')
  })

  it('Call /api/v1/token?command=new -> 200', async () => {
    const response = await server.inject({ method: 'GET', url: '/api/v1/token?command=new' })
    expect(response.result.error).to.exist()
  })

  it('Call /api/v1/token?command=access -> 200', async () => {
    const response = await server.inject({ method: 'GET', url: '/api/v1/token?command=access' })
    expect(response.result.error).to.exist()
  })

  it('Call /api/v1/token?command=refresh -> 200', async () => {
    const response = await server.inject({ method: 'GET', url: '/api/v1/token?command=refresh' })
    expect(response.result.error).to.exist()
  })

  it('Call /api/v1/history -> 200', async () => {
    const response = await server.inject({ method: 'GET', url: '/api/v1/history' })
    console.log(response.result)
    expect(response.result).to.equal('Saved records: 1')
  })
})

experiment('server.js - extra timeout needed', { timeout: 3000 }, () => {
  it('Call /api/v1/init -> 200', async () => {
    const response = await server.inject({ method: 'GET', url: '/api/v1/init' })
    expect(response.result.expires).to.equal(666)
  })
})
