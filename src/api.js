'use strict'

const jsonDb = require('./database')
const hapiServer = require('./server')

jsonDb.init().then(async (db) => {
  await hapiServer.start(db)
}).catch((err) => console.log('Err', err))
