'use strict'

const tellstick = require('../tellstick/proxy')

function updateTokens (command, message) {
  console.log('UPDATE', command, message)
  if (!message) { return }

  const { authUrl, token, expires, allowRenew } = message

  switch (command) {
    case 'new':
      return { authUrl, requestToken: token }
    case 'access':
      return { allowRenew, expires: expires * 1000, accessToken: token }
    case 'refresh':
      return { expires: expires * 1000, accessToken: token }
    default:
  }
}

module.exports = {
  method: 'GET',
  path: '/api/{version}/token',
  handler: async (request, h) => {
    console.log('ROUTE', '/{version}/token')
    const params = { type: 'token', ...request.params, ...request.query }
    const result = await tellstick.callApi(params)

    if (result.success) {
      const db = request.db()

      const update = updateTokens(params.command, result.message)
      db.get('token').assign(update).write()
      // const token = {
      //   ...db.get('token').value(),
      //   ...updateTokens(params.command, result.message)
      // }
      // console.log('TOKEN', token)
    }

    return h.response(result)
  }
}
