'use strict'

const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const format = require('date-fns/format')
const isEmpty = require('lodash.isempty')
const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)
const difference = require('./differense')
const { tellstickApi } = require('../tellstick/proxy')

let TICKER_INTERVAL = 1000 * 60 * 5 // Save history every 5 min
let DATABASE_PATH = './database'

let jsonDb
let adapter
let run = false
let timeout
let prevMessage = {}

async function cronAction (db = jsonDb) {
  try {
    const { success, message } = await tellstickApi({ type: 'sensors' })

    if (success) {
      const messageDiff = difference(message, prevMessage)
      prevMessage = message

      if (!isEmpty(messageDiff)) {
        // console.log(messageDiff)
        db.set(Date.now(), messageDiff).write()
      }
    }
  } catch (err) {
    console.log('Error API History', err)
  }
}

async function createOrOpenNewDatabaseFile () {
  const todaysDate = format(new Date(), 'YYYY-MM-DD')
  const source = `${DATABASE_PATH}/history-${todaysDate}.json`

  if (!adapter || source !== adapter.source) {
    // Create new database file
    adapter = new FileAsync(source)
    jsonDb = await low(adapter).catch((err) => console.log('Error', err))
    console.log('History logg started: ', adapter.source)

    // Clear prevMessage to make sure the first saved status is a full object
    prevMessage = {}
  }
}

async function cronTicker (intervall) {
  // Create new db file every day or if it doesn't exists
  await createOrOpenNewDatabaseFile()

  // Run cron action
  cronAction()

  // Wait until next tick and recursivly call cronTicker
  if (run) {
    timeout = await setTimeoutPromise(intervall)
    cronTicker()
  }
}

module.exports.start = async function start (intervall, runOnce = false) {
  run = !runOnce
  cronTicker(intervall || TICKER_INTERVAL)
}

module.exports.stop = async function stop () {
  run = false
  clearInterval(timeout)
  console.log('History logg stopped: ', adapter.source)
}
