'use strict'

module.exports = {
  method: 'GET',
  path: '/api/{version}',
  handler: async (request, h) => {
    const { version } = request.params

    return h
      .response({ [version]: version === 'v1' ? 'OK' : 'Not supported' })
      .code(version === 'v1' ? 200 : 403)
  }
}
