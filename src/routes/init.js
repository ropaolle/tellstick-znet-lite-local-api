'use strict'

const { tellstickApi } = require('../tellstick/proxy')

// Convert array to object, index by id and add favorites and type
function addFavoritesTypeAndIndexedById (devices, favorites, type = null) {
  return devices.reduce((acc, device) => {
    acc[device.id] = {
      ...device,
      type: type || device.type,
      favorite: favorites.indexOf(device.id) !== -1
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
    // Load data from db
    const db = request.db()
    const favorites = db.get('app.favorites').value()

    // Get data from Tellstick
    const deviceData = await tellstickApi({ type: 'devices' })
    const sensorData = await tellstickApi({ type: 'sensors' })

    const response = {
      success: deviceData.success && sensorData.success,
      error: deviceData.error || sensorData.error, // Only displays the first error
      allowRenew: db.get('app.allowRenew').value(),
      expires: db.get('app.expires').value()
    }

    if (deviceData.success && sensorData.success) {
      let sensors = sensorData.message.sensor
      let devices = removeSensorsFromDeviceList(deviceData.message.device, sensors)
      response.devices = addFavoritesTypeAndIndexedById(devices, favorites)
      response.sensors = addFavoritesTypeAndIndexedById(sensors, favorites, 'sensor')
    }

    return h.response(response)
  }
}
