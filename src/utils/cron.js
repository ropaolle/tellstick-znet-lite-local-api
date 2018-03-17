'use strict'

const CronJob = require('cron').CronJob
// const isEqual = require('lodash.isequal')
const isEmpty = require('lodash.isempty')
const difference = require('./differense')
const jsonDb = require('./database')
const { tellstickApi } = require('../tellstick/proxy')

let PREV_MESSAGE

// '* 15 * * * *' Every hour + 15 min
// '* */5 * * * *' Every 5'th min
// '*/3 * * * * *' Every 3'rd sec
module.exports.minMax = new CronJob({
  cronTime: '* */5 * * * *',
  onTick: () => tick({ minMax: true }),
  start: false
})

module.exports.history = new CronJob({
  cronTime: '* 15 * * * *',
  onTick: () => tick({ history: true }),
  start: false
})

function updateMinMax (message) {
  const db = jsonDb.db()
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

function updateHistory (message) {
  // Exclude model, name, protocol, sensorId
  const messageToKeep = message.sensor.map(({ model, name, protocol, sensorId, ...keep }) => keep)
  const db = jsonDb.db()

  if (!PREV_MESSAGE) {
    // Store a complete copy of the first message.
    db.set(`history.${Date.now()}`, messageToKeep).write()
  } else {
    // Store the diff if the massage is changed
    const messageDiff = difference(messageToKeep, PREV_MESSAGE)
    if (!isEmpty(messageDiff)) {
      db.set(`history.${Date.now()}`, messageDiff).write()
    }
  }

  PREV_MESSAGE = messageToKeep
}

async function tick ({ minMax = false, history = false }) {
  try {
    const { success, message, error } = await tellstickApi({ type: 'sensors' })

    if (!success) {
      return console.log('Error API History', error)
    }

    if (minMax) { updateMinMax(message) }
    if (history) { updateHistory(message) }
  } catch (err) {
    return console.log('Error API History', err)
  }
}
