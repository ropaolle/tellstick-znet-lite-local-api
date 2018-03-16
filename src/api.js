'use strict'

const jsonDb = require('./utils/database')
const history = require('./history')
const hapiServer = require('./utils/server')

async function runApi () {
  const db = await jsonDb.init().catch((err) => console.log('Database error', err))
  await history.start()
  await hapiServer.start(db)
}

runApi()
