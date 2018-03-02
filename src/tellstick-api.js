'use strict'

const Wreck = require('wreck')
const fs = require('fs')
const Querystring = require('querystring')
const tellstick = require('./tellstick-parse')

const API_URL = 'http://192.168.10.104/'
const API_PATH = '/api'
const AUTH_PATH = `${__dirname}/auth.json`

let auth = require('./auth.json')

function updateAuth (body) {
  fs.writeFile(AUTH_PATH, JSON.stringify({ ...auth, ...body }, null, 4), (err) => {
    if (err) throw err
    console.log('Tokens have been udated!')
  })
}

function getHeaders ({ type, command }) {
  let result = {
    method: 'GET',
    options: {
      baseUrl: API_URL,
      headers: {
        authorization: `Bearer ${auth.token}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET'
      }
    }
  }

  // Token options
  if (type === 'token') {
    if (command === 'new') {
      result.method = 'PUT'
      result.options.headers = {
        'content-type': 'application/x-www-form-urlencoded'
      }
      result.options.payload = Querystring.stringify({ app: 'tzll' })
    } else if (command === 'access') {
      delete result.options.headers
    }
  }

  return result
}

module.exports.callApi = async function (request) {
  const result = {
    success: false,
    expires: auth.expires, // new Date(auth.expires * 1000).toString()
    allowRenew: auth.allowRenew
  }

  // Insert access token
  if (request.type === 'token' && request.command === 'access') {
    request.token = auth.token
  }

  const parsedCommand = tellstick.parseAll(request)

  if (parsedCommand) {
    const uri = `${API_PATH}/${parsedCommand}`
    const { method, options } = getHeaders(request)

    const promise = Wreck.request(method, uri, options)

    try {
      const res = await promise
      // json: 'strict' returns an error in case of none json resonse.
      const body = await Wreck.read(res, { json: 'strict' })

      // Save tokens
      if (request.type === 'token' && body.token) {
        updateAuth(body)
      }

      return {
        ...result,
        success: !body.error,
        message: (body.error) ? body.error : body
      }
    } catch (err) {
      return {
        ...result,
        message: err.message,
        errorCode: err.output.statusCode
      }
    }
  }

  return result
}
