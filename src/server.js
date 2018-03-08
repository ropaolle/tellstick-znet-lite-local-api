'use strict'

const Hapi = require('hapi')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const routes = require('./routes')
const { setAccessToken } = require('./tellstick/proxy')

const DEFAULT_DB = {
  port: 4000,
  app: {
    favorites: [2, 6]
  }
}

const server = new Hapi.Server({ routes: { cors: true } })

// Import routes
server.route(routes)

// Create database instance and start HAPI server
const adapter = new FileAsync('database.json')
low(adapter)
  .then(db => {
    // Add db ref to the request object
    server.decorate('request', 'db', () => db)

    // Load defalts if db file is missing
    return db.defaults(DEFAULT_DB).write()
  })
  .then(db => {
    // Make accessToken availible to the proxy
    setAccessToken(db.app.accessToken)

    // Start the server
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
