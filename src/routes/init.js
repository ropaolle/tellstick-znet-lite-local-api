'use strict'

const { tellstickApi } = require('../tellstick/proxy')

// Convert array to object and index by id and add favorites and type
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

module.exports = {
  method: 'GET',
  path: '/api/v1/init',
  handler: async (request, h) => {
    const deviceData = await tellstickApi({ type: 'devices' })
    const sensorData = await tellstickApi({ type: 'sensors' })

    // Load data from db
    const db = request.db()
    const favorites = db.get('app.favorites').value()

    const response = {
      success: deviceData.success && sensorData.success,
      error: deviceData.error || sensorData.error, // Only displays the first error
      allowRenew: db.get('app.allowRenew').value(),
      expires: db.get('app.expires').value()
    }

    // Remove sensors from the device list
    if (deviceData.success && sensorData.success) {
      const devices = deviceData.data.device.filter(device => !sensorData.data.sensor.find(sensor => sensor.id === device.id))
      response.devices = addFavoritesTypeAndIndexedById(devices, favorites)
      response.sensors = addFavoritesTypeAndIndexedById(sensorData.data.sensor, favorites, 'sensor')
    }

    return h.response(response)
  }
}
