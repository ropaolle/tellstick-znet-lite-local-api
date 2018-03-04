'use strict'

const Hapi = require('hapi')
const tellstick = require('./tellstick-api')

const server = new Hapi.Server({
  port: 3000,
  host: 'localhost' // 192.168.10.146
})

// server.events.on('log', (event) => {
//   console.log('HAPI LOGG', JSON.stringify(event.tags.pop()))
// })

server.route({
  method: 'GET',
  path: '/{version}',
  handler: async (request, h) => {
    const version = request.params.version

    return h.response(version).code((version === 'v1') ? 200 : 404)
  }
})

server.route({
  method: 'GET',
  path: '/{version}/token/{command?}',
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

// if (!module.parent) {}

server
  .start()
  .then(() => {
    return console.log(`Server running at: ${server.info.uri}`)
  })
  .catch(err => {
    return console.error('ERR', err)
  })

// Used by tests
module.exports = server
