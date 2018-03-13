'use strict'

const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

const isEmpty = require('lodash.isempty')
const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

const difference = require('./differense')
const { tellstickApi } = require('../tellstick/proxy')

/**
 * Json file database
 */
const DATABASE_FILE = 'history.json'
let CRON_DELAY = 1000 * 60 * 5 // 5 min

let adapter = null
let jsonDb = null

module.exports.init = async function init (filename) {
  if (jsonDb === null) {
    adapter = new FileAsync(filename || DATABASE_FILE)
    jsonDb = await low(adapter).catch((err) => console.log('Error', err))

    cronAction(jsonDb)
  }

  return jsonDb
}

/**
 * Cron/timeout function
 */

let prevMessage = {}

async function cronAction (db, delay = CRON_DELAY) {
  await setTimeoutPromise(delay)

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

  cronAction(db, delay)
}
