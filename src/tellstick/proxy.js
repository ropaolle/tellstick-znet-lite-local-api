'use strict'

const Wreck = require('wreck')
const Querystring = require('querystring')
const tellstick = require('./parse')

let accessToken

module.exports.setAccessToken = function setAccessToken (token) {
  accessToken = token
}

function getHeaders ({ type, command }) {
  let result = {
    method: 'GET',
    options: {
      timeout: 1000,
      baseUrl: 'http://192.168.10.104/api/',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET'
      }
    }
  }

  if (type === 'token') {
    if (command === 'new') {
      result.method = 'PUT'
      result.options.headers = { 'content-type': 'application/x-www-form-urlencoded' }
      result.options.payload = Querystring.stringify({ app: 'tzll' })
    } else if (command === 'access') {
      delete result.options.headers
    }
  }

  return result
}

module.exports.tellstickApi = async function (request) {
  // console.log('tellstickApi', request, accessToken)

  const url = tellstick.parseAll(request)
  if (!url) { return { success: false, message: 'Unknown command!' } }

  const { method, options } = getHeaders(request)
  const promise = Wreck.request(method, url, options)

  try {
    const res = await promise
    // json: 'strict' returns an error in case of none json resonse.
    const body = await Wreck.read(res, { json: 'strict' })

    return { success: !body.error, message: body.error ? body.error : body }
  } catch (err) {
    return { sucess: false, message: err.message }
  }
}
