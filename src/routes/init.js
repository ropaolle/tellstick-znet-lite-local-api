'use strict'

const { tellstickApi } = require('../tellstick/proxy')

module.exports = {
  method: 'GET',
  path: '/api/v1/init',
  handler: async (request, h) => {
    const result = await tellstickApi({ type: 'devices' })

    // Load data from db
    const db = request.db()
    result.allowRenew = db.get('app.allowRenew').value()
    result.expires = db.get('app.expires').value()
    result.favorites = db.get('app.favorites').value()

    return h.response(result)
  }
}
