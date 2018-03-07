'use strict'

const Hapi = require('hapi')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const tellstick = require('./tellstick/proxy')

const DEFAULT_DB = {
  port: 4000,
  app: {
    expires: 0,
    favorites: [2, 6]
  }
}

const server = new Hapi.Server({
  // port: 4000, // Port is loaded from db file
  // host: '192.168.10.146', // Not needed
  routes: { cors: true }
})

server.route({
  method: 'GET',
  path: '/{version}',
  handler: async (request, h) => {
    const { version } = request.params

    return h.response(version).code(version === 'v1' ? 200 : 404)
  }
})

server.route({
  method: 'GET',
  path: '/{version}/init',
  handler: async (request, h) => {
    const result = await tellstick.callApi({ type: 'devices' })
    // Load data from db
    const db = request.db()
    result.app = db.get('app').value() // Get all data db.getState()

    // Save data
    // db.get('app.favorites').push(666).write()
    // db.get('app').assign({ expires: 0 }).write()
    // db.set('app.expires', 666).write()

    return h.response(result)
  }
})

function updateTokens (command, message) {
  console.log('UPDATE', command, message)
  if (!message) { return }

  const { authUrl, token, expires, allowRenew } = message

  switch (command) {
    case 'new':
      return { authUrl, requestToken: token }
    case 'access':
      return { allowRenew, expires: expires * 1000, accessToken: token }
    case 'refresh':
      return { expires: expires * 1000, accessToken: token }
    default:
  }
}

server.route({
  method: 'GET',
  path: '/{version}/token',
  handler: async (request, h) => {
    const params = { type: 'token', ...request.params, ...request.query }
    const result = await tellstick.callApi(params)

    if (result.success) {
      const db = request.db()

      const update = updateTokens(params.command, result.message)
      db.get('token').assign(update).write()
      // const token = {
      //   ...db.get('token').value(),
      //   ...updateTokens(params.command, result.message)
      // }
      // console.log('TOKEN', token)
    }

    return h.response(result)
  }
})

server.route({
  method: 'GET',
  path: '/{version}/{type}/{id?}',
  handler: async (request, h) => {
    const params = { ...request.params, ...request.query }
    const result = await tellstick.callApi(params)

    return h.response(result)
  }
})

// Create database instance and start HAPI server
const adapter = new FileAsync('db.json')
low(adapter)
  .then(db => {
    // Add db ref to the request object
    server.decorate('request', 'db', () => db)

    // Load defalts if db file is missing
    return db.defaults(DEFAULT_DB).write()
  })
  .then((db) => {
    server.settings.port = db.port
    server
      .start()
      .then(() => {
        return console.log(`Server running at: ${server.info.uri}\n`)
      })
      .catch(err => {
        return console.error('ERR', err)
      })
  })

// Used by tests
module.exports = server
