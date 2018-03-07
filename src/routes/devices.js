'use strict'

const tellstick = require('../tellstick/proxy')

module.exports = {
  method: 'GET',
  path: '/api/{version}/{type}/{id?}',
  handler: async (request, h) => {
    console.log('ROUTE', '/{version}/{type}/{id?}')
    const params = { ...request.params, ...request.query }
    const result = await tellstick.callApi(params)

    return h.response(result)
  }
}
