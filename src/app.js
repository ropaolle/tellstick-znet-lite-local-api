'use strict'

const Hapi = require('hapi')
const tellstick = require('./tellstick')

const server = new Hapi.Server({
  port: 3000,
  host: 'localhost' // 192.168.10.146
})

// const API_URL = 'http://192.168.10.104/api/';
// const AUTH_PATH = `${__dirname}/authorization.json`;
// const auth = require('./authorization.json');

server.route({
  method: 'GET',
  path: '/token/{command?}',
  handler: (request, h) => {
    const tellstickQuery = tellstick.parse({type: 'token', ...request.params, ...request.query})
    return `Token: ${tellstickQuery}`
  }
})

server.route({
  method: 'GET',
  path: '/{type}/{id?}',
  handler: (request, h) => {
    const tellstickQuery = tellstick.parse({...request.params, ...request.query})
    return `TellstickQuery: ${tellstickQuery}`
  }
})

server
  .start()
  .then(() => {
    console.log(`Server running at: ${server.info.uri}`)
  })
  .catch(err => {
    console.error(err)
  })
