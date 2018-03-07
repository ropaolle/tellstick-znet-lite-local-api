'use strict'

const Hapi = require('hapi')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const routes = require('./routes')

const DEFAULT_DB = {
  port: 4000,
  token: {},
  favorites: [2, 6]
}

const server = new Hapi.Server({
  // port: 4000,             // Port is loaded from db
  // host: '192.168.10.146', // Not needed
  routes: { cors: true }
})

server.route(routes)

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
