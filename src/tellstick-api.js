'use strict'

const Wreck = require('wreck')
const Querystring = require('querystring')
const fs = require('fs')
const tellstick = require('./tellstick-parse')

const API_URL = 'http://192.168.10.104/api/'
const AUTH_PATH = `${__dirname}/auth.json`

let auth = require('./auth.json')

function updateAuthFile (request, body) {
  if (!body || !request) { return }

  switch (request.command) {
    case 'new':
      auth.authUrl = body.authUrl
      auth.requestToken = body.token
      break
    case 'access':
      auth.allowRenew = body.allowRenew
      auth.expires = body.expires * 1000 // Unix timestamp to datetime
      auth.accessToken = body.token
      break
    case 'refresh':
      auth.expires = body.expires * 1000
      auth.accessToken = body.token
      break
    default:
      return
  }

  fs.writeFile(AUTH_PATH, JSON.stringify(auth, null, 4), err => {
    if (err) throw err
  })
}

const DEFAULT_OPTIONS = {
  timeout: 1000,
  baseUrl: API_URL,
  headers: {
    authorization: `Bearer ${auth.accessToken}`,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET'
  }
}

function getHeaders ({ type, command }, parsedCommand) {
  // console.log('getHeader', type, command, parsedCommand)
  if (!parsedCommand) return {}

  let result = {
    method: 'GET',
    url: parsedCommand,
    options: DEFAULT_OPTIONS
  }

  if (type === 'token') {
    if (command === 'new') {
      result.method = 'PUT'
      result.options.headers = { 'content-type': 'application/x-www-form-urlencoded' }
      result.options.payload = Querystring.stringify({ app: 'tzll' })
    } else if (command === 'access') {
      delete result.options.headers // TODO: Is this needed?
    }
  }

  return result
}

// const DEFAULT_RESULT = {
//   success: false,
//   expires: auth.expires,
//   allowRenew: auth.allowRenew
// }

module.exports.callApi = async function (request) {
  // console.log('R', request)
  // Insert request token
  if (request.type === 'token' && request.command === 'access') {
    request.token = auth.requesToken
  }

  const parsedCommand = tellstick.parseAll(request)
  if (!parsedCommand) { return { success: false, message: 'Unknown command!' } }

  const { method, options, url } = getHeaders(request, parsedCommand)
  const promise = Wreck.request(method, url, options)

  try {
    const res = await promise
    // json: 'strict' returns an error in case of none json resonse.
    const body = await Wreck.read(res, { json: 'strict' })

    // updateAuthFile(request, body)

    return { success: !body.error, message: body.error ? body.error : body }
  } catch (err) {
    return { sucess: false, message: err.message }
  }
}
