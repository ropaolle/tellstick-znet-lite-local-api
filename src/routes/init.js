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

/* function addFavoritesTypeAndIndexedById (devices, favorites, type) {
  // Add favorites
  let result = devices.map(device => ({
    ...device, favorite: favorites.indexOf(device.id) !== -1
  }))

  // Add type
  if (type) {
    result = result.map(device => ({ ...device, type }))
  }

  return result.reduce((acc, device) => {
    acc[device.id] = { ...device }
    return acc
  }, {})
} */

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
      allowRenew: db.get('app.allowRenew').value(),
      expires: db.get('app.expires').value()
    }

    if (deviceData.success) {
      response.devices = addFavoritesTypeAndIndexedById(deviceData.data.device, favorites)
    } else {
      response.error = deviceData.error
    }

    if (sensorData.success) {
      response.sensors = addFavoritesTypeAndIndexedById(sensorData.data.sensor, favorites, 'sensor')
    } else {
      response.error = sensorData.error
    }

    return h.response(response)
  }
}
