'use strict'

const { tellstickApi } = require('../tellstick/proxy')

module.exports = {
  method: 'GET',
  path: '/api/v1/{type}',
  handler: async (request, h) => {
    const params = { ...request.params, ...request.query }
    const result = await tellstickApi(params)

    return h.response(result)
  }
}
