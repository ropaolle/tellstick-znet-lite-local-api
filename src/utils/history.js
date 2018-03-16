'use strict'

const CronJob = require('cron').CronJob
// const isEqual = require('lodash.isequal')
const isEmpty = require('lodash.isempty')
const difference = require('./differense')
const jsonDb = require('./database')
const { tellstickApi } = require('../tellstick/proxy')

let prevMessage

// '* */5 * * * *' Every 5'th min
// '*/3 * * * * *' Every 3'rd sec
const job = new CronJob({
  cronTime: '* */5 * * * *',
  onTick: tick,
  start: false
})

async function tick () {
  try {
    const { success, message } = await tellstickApi({ type: 'sensors' })
    // console.log('tellstickApi', success, message, error)

    if (success) {
      // Exclude model, name, protocol, sensorId
      const messageToKeep = message.sensor.map(({ model, name, protocol, sensorId, ...keep }) => keep)
      const db = jsonDb.db()

      // Store a complete copy of the first message. Else, if changed store a diff.
      if (!prevMessage) {
        // console.log('FULL MSG', message)
        db.set(`history.${Date.now()}`, messageToKeep).write()
      } else {
        const messageDiff = difference(messageToKeep, prevMessage)
        if (!isEmpty(messageDiff)) {
          // console.log('DIFF MSG', messageDiff)
          db.set(`history.${Date.now()}`, messageDiff).write()
        }
      }

      prevMessage = messageToKeep
    }
  } catch (err) {
    console.log('Error API History', err)
  }
}

module.exports = job
