'use strict'

module.exports = {
  method: 'GET',
  path: '/api/v1/minmax',
  handler: async (request, h) => {
    const db = request.db()
    db.set('app.minMax', {}).write()

    return h.response({ success: true, message: 'minMax cleared' })
  }
}
