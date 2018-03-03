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

async function callApi (params) {
  const result = await tellstick.callApi(params)

  server.log({ ...params, ...result })
  return `Token: ${JSON.stringify(result)}`
}

server.route({
  method: 'GET',
  path: '/{version}/token/{command?}',
  handler: async request => {
    return callApi({ type: 'token', ...request.params, ...request.query })
  }
})

server.route({
  method: 'GET',
  path: '/{version}/{type}/{id?}',
  handler: async request => {
    return callApi({ ...request.params, ...request.query })
  }
})

// TODO: Do not start the server during tests. What is best practis?
// if (process.env.NODE_ENV !== 'test') {
//   server
//     .start()
//     .then(() => {
//       return console.log(`Server running at: ${server.info.uri}`)
//     })
//     .catch(err => {
//       console.error(err)
//     })
// }

// module.exports = server
