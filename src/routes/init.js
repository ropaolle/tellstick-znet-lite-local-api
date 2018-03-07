'use strict'

const tellstick = require('../tellstick/proxy')

module.exports = {
  method: 'GET',
  path: '/api/{version}/init',
  handler: async (request, h) => {
    console.log('ROUTE', '/{version}/init')
    const result = await tellstick.callApi({ type: 'devices' })
    // Load data from db
    const db = request.db()
    result.app = db.get('app').value() // Get all data db.getState()

    // Save data
    // db.get('app.favorites').push(666).write()
    // db.get('app').assign({ expires: 0 }).write()
    // db.set('app.expires', 666).write()

    return h.response(result)
  }
}
