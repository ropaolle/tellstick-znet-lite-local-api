'use strict'

const Wreck = require('wreck')
const Querystring = require('querystring')
const fs = require('fs')
const tellstick = require('./tellstick-parse')

const API_URL = 'http://192.168.10.1044/'
const API_PATH = '/api'

let auth = require('./auth.json')
const AUTH_PATH = `${__dirname}/auth.json`

function updateToken (data) {
  // Convert Unix timestamp to datetime
  if (data.expires) { data.expires = data.expires * 1000 }
  auth = { ...auth, ...data, updated: Date.now() }

  fs.writeFile(AUTH_PATH, JSON.stringify(auth, null, 4), err => {
    if (err) throw err
  })
}

function getHeaders ({ type, command }, parsedCommand) {
  if (!parsedCommand) return {}

  let result = {
    method: 'GET',
    url: `${API_PATH}/${parsedCommand}`,
    options: {
      baseUrl: API_URL,
      headers: {
        authorization: `Bearer ${auth.token}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET'
      }
    }
  }

  if (type === 'token' && command === 'new') {
    result.method = 'PUT'
    result.options.headers = { 'content-type': 'application/x-www-form-urlencoded' }
    result.options.payload = Querystring.stringify({ app: 'tzll' })
  }

  if (type === 'token' && command === 'access') {
    delete result.options.headers
  }

  return result
}

const DEFAULT_RESULT = {
  success: false,
  expires: auth.expires,
  allowRenew: auth.allowRenew
}

module.exports.callApi = async function (request) {
  // Insert access token
  if (request.type === 'token' && request.command === 'access') {
    request.token = auth.token
  }

  let { method, options, url } = getHeaders(request, tellstick.parseAll(request))
  if (!url) { return DEFAULT_RESULT }

  const promise = Wreck.request(method, url, options)

  try {
    const res = await promise
    // json: 'strict' returns an error in case of none json resonse.
    const body = await Wreck.read(res, { json: 'strict' })

    // Save tokens
    if (request.type === 'token' && body.token) {
      updateToken(body)
    }

    return {
      ...DEFAULT_RESULT,
      success: !body.error,
      message: body.error ? body.error : body
    }
  } catch (err) {
    return {
      ...DEFAULT_RESULT,
      message: err.message,
      errorCode: err.output.statusCode
    }
  }
}
