'use strict'

module.exports = {
  method: 'GET',
  path: '/api/v1/history',
  handler: async (request, h) => {
    const db = request.db()
    const history = db.get('history').value()
    const keys = Object.keys(history)
    const items = keys.map(val => new Date(Number(val)))

    return h.response({ success: true, message: `Saved records: ${items.length}` })
  }
}
