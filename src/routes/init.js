'use strict'

const { tellstickApi } = require('../tellstick/proxy')

const addDeviceParams = favorites => deviceId =>
  ({ favorite: favorites.indexOf(deviceId) !== -1 })

const addSensorParams = (favorites, type, minMax) => deviceId => {
  return {
    favorite: favorites.indexOf(deviceId) !== -1,
    type,
    minMax: minMax[deviceId]
  }
}

// Convert array to object and index by id
function indexedById (devices, addParams) {
  return devices.reduce((acc, device) => {
    acc[device.id] = {
      ...device,
      ...addParams(device.id)
    }
    return acc
  }, {})
}

function removeSensorsFromDeviceList (devices, sensors) {
  return devices.filter(
    device => sensors.find(sensor => sensor.id === device.id)
  )
}

module.exports = {
  method: 'GET',
  path: '/api/v1/init',
  handler: async (request, h) => {
    // Get data from Tellstick
    const deviceData = await tellstickApi({ type: 'devices' })
    const sensorData = await tellstickApi({ type: 'sensors' })

    // Load data from db
    const db = request.db()
    const { favorites, allowRenew, expires, minMax = [] } = db.get('app').value()

    const response = {
      success: deviceData.success && sensorData.success,
      error: deviceData.error || sensorData.error, // Only displays the first error
      allowRenew,
      expires
    }

    if (deviceData.success && sensorData.success) {
      let sensors = sensorData.message.sensor
      let devices = removeSensorsFromDeviceList(deviceData.message.device, sensors)
      response.devices = indexedById(devices, addDeviceParams(favorites))
      response.sensors = indexedById(sensors, addSensorParams(favorites, 'sensor', minMax))

      console.log(response.sensors)
    }

    return h.response(response)
  }
}
