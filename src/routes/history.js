'use strict'

module.exports = {
  method: 'GET',
  path: '/api/v1/history',
  handler: async (request, h) => {
    const db = request.db()
    const history = db.get('history').value()

    const keys = Object.keys(history)
    const items = keys.map(val => new Date(Number(val)))
    // console.log(items.length)

    return h.response(`Saved records: ${items.length}`)
  }
}
