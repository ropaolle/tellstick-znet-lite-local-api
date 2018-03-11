'use strict'

const Hapi = require('hapi')
const routes = require('./routes')

const server = new Hapi.Server({ routes: { cors: true } })

// Import routes
server.route(routes)

module.exports.start = async function start (db) {
  // Add db ref to the request object
  server.decorate('request', 'db', () => db)

  // Load port from db
  server.settings.port = db.get('port').value()

  await server.start(() => server).catch(err => console.error('Error', err))
  console.log(`Server running at: ${server.info.uri}`)

  return server
}

module.exports.stop = async () => {
  await server.stop()
  console.log('Server stopped')
}
