'use strict'

const jsonDb = require('./database')
const history = require('./history')
const hapiServer = require('./server')

jsonDb.init().then(async (db) => {
  await hapiServer.start(db)
  await history.init()
}).catch((err) => console.log('Err', err))
