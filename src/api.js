'use strict'

const Hapi = require('hapi')
const tellstick = require('./tellstick-api')

const server = new Hapi.Server({
  port: 3000,
  host: 'localhost' // 192.168.10.146
})

server.route({
  method: 'GET',
  path: '/{version}/token/{command?}',
  handler: async (request) => {
    const result = await tellstick.callApi({
      type: 'token',
      ...request.params,
      ...request.query
    })

    server.log({ ...request.params, ...request.query, ...result })
    return `Token: ${JSON.stringify(result)}`
  }
})

server.route({
  method: 'GET',
  path: '/{version}/{type}/{id?}',
  handler: async (request) => {
    const result = await tellstick.callApi({
      ...request.params,
      ...request.query
    })

    server.log({ ...request.params, ...request.query, ...result })
    return `Token: ${JSON.stringify(result)}`
  }
})

server.events.on('log', (event) => {
  // console.log('HAPI LOGG', JSON.stringify(event.tags.pop()))
})

server
  .start()
  .then(() => {
    return console.log(`Server running at: ${server.info.uri}`)
  })
  .catch(err => {
    console.error(err)
  })
