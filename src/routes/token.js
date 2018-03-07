'use strict'

const { tellstickApi, setAccessToken } = require('../tellstick/proxy')

function updateTokens (command, message) {
  if (!message) { return }

  const { authUrl, token, expires, allowRenew } = message

  switch (command) {
    case 'new':
      return { authUrl, requestToken: token }
    case 'access':
      setAccessToken(token)
      return { allowRenew, expires: expires * 1000, accessToken: token }
    case 'refresh':
      return { expires: expires * 1000, accessToken: token }
    default:
  }
}

module.exports = {
  method: 'GET',
  path: '/api/v1/token',
  handler: async (request, h) => {
    const db = request.db()
    const requestToken = db.get('app.requestToken').value()
    const params = { type: 'token', ...request.query, requestToken }

    const result = await tellstickApi(params)

    // Save tokens to db
    if (result.success) {
      const update = updateTokens(params.command, result.message)
      db.get('app').assign(update).write()
    }

    // Do not expose token to browser
    delete result.message.token

    return h.response(result)
  }
}
