'use strict'

const jsonDb = require('./utils/database')
const hapiServer = require('./utils/server')
const history = require('./utils/history')

async function runApi () {
  const db = await jsonDb.init().catch((err) => console.log('Database error', err))
  await hapiServer.start(db)
  history.start()
}

runApi()
