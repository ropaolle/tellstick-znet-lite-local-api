'use strict'

module.exports = {
  method: 'GET',
  path: '/api/v1/ping',
  handler: async (request, h) => {
    return h.response({ success: true, message: 'pong' })
  }
}
