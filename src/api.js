'use strict'

const jsonDb = require('./utils/database')
const hapiServer = require('./utils/server')
const { minMax, history } = require('./utils/cron')

async function runApi () {
  const db = await jsonDb.init().catch((err) => console.log('Database error', err))
  await hapiServer.start(db)
  minMax.start()
  history.start()
}

runApi()
