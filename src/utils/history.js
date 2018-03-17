'use strict'

const CronJob = require('cron').CronJob
// const isEqual = require('lodash.isequal')
const isEmpty = require('lodash.isempty')
const difference = require('./differense')
const jsonDb = require('./database')
const { tellstickApi } = require('../tellstick/proxy')

let PREV_MESSAGE

// '* */5 * * * *' Every 5'th min
// '*/3 * * * * *' Every 3'rd sec
const job = new CronJob({
  cronTime: '*/10 * * * * *',
  onTick: tick,
  start: false
})

function updateMinMax (message, db) {
  const minMaxObj = db.get('app.minMax').value()

  message.sensor.forEach(sensor => {
    const minMax = minMaxObj[sensor.id]
    const { temp } = sensor
    const update = { temp: sensor.temp, updated: Date.now() }
    let updatedMinMax

    // Add if missing
    if (!minMax) {
      updatedMinMax = { min: update, max: update }
    // Update min
    } else if (temp < minMax.min.temp) {
      updatedMinMax = { ...minMax, min: update }
    // Update max
    } else if (temp > minMax.max.temp) {
      updatedMinMax = { ...minMax, max: update }
    }

    if (updatedMinMax) {
      db.set(`app.minMax.${sensor.id}`, updatedMinMax).write()
    }
  })
}

function updateHistory (messageToKeep, db) {
  if (!PREV_MESSAGE) {
    // Store a complete copy of the first message.
    db.set(`history.${Date.now()}`, messageToKeep).write()
  } else {
    // Store the diff if the massage is changed
    const messageDiff = difference(messageToKeep, PREV_MESSAGE)
    if (!isEmpty(messageDiff)) {
      // console.log('DIFF MSG', messageDiff)
      db.set(`history.${Date.now()}`, messageDiff).write()
    }
  }
}

async function tick () {
  try {
    const { success, message, error } = await tellstickApi({ type: 'sensors' })

    if (error) {
      return console.log('Error API History', error)
    }

    if (success) {
      // Exclude model, name, protocol, sensorId
      const messageToKeep = message.sensor.map(({ model, name, protocol, sensorId, ...keep }) => keep)
      const db = jsonDb.db()

      updateMinMax(message, db)

      updateHistory(messageToKeep, db)

      PREV_MESSAGE = messageToKeep
    }
  } catch (err) {
    return console.log('Error API History', err)
  }
}

module.exports = job
