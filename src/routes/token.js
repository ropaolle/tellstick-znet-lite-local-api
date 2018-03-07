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

    if (result.success) {
      // Save tokens to db
      const update = updateTokens(params.command, result.message)
      db.get('app').assign(update).write()

      // Notify client about new token
      if (update.accessToken) {
        result.message.newAccessToken = true
        result.message.expires *= 1000 // Convert Unix timestamp to datetime
      }
    }

    // Do not expose token to browser
    delete result.message.token

    return h.response(result)
  }
}
