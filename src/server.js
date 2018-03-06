'use strict'

const Hapi = require('hapi')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

const tellstick = require('./tellstick-api')

const server = new Hapi.Server({
  // port: 4000,
  // host: 'localhost',
  // host: '192.168.10.146',
  routes: { cors: true }
})

server.route({
  method: 'GET',
  path: '/{version}',
  handler: async (request, h) => {
    const version = request.params.version
    // const { version } = request.params

    return h.response(version).code(version === 'v1' ? 200 : 404)
  }
})

server.route({
  method: 'GET',
  path: '/{version}/token', // TODO: Remove command?
  handler: async (request, h) => {
    const params = { type: 'token', ...request.params, ...request.query }
    const result = await tellstick.callApi(params)

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

// Create database instance and start server
const adapter = new FileAsync('db.json')
low(adapter)
  .then(db => {
    return db.defaults({ port: 4000, favorites: [2, 6] }).write()
  })
  .then((db) => {
    server.settings.port = db.port
    server
      .start()
      .then(() => {
        return console.log(`Server running at: ${server.info.uri}`)
      })
      .catch(err => {
        return console.error('ERR', err)
      })
  })

// Used by tests
module.exports = server
