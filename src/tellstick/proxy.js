'use strict'

const Wreck = require('wreck')
const Querystring = require('querystring')
const tellstick = require('./parse')
const { db } = require('../utils/database')

const wreck = Wreck.defaults({
  timeout: 1000,
  baseUrl: 'http://192.168.10.163/api/' // DHCP Static IP-mapping: TellStick-ZNet-Lite ac:ca:54:01:a9:93 192.168.10.163
})

function getHeaders ({ type, command }) {
  const accessToken = db().get('app.accessToken').value()

  if (type === 'token' && command === 'new') {
    return {
      method: 'PUT',
      options: {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        payload: Querystring.stringify({ app: 'tzll' })
      }
    }
  }

  return {
    method: 'GET',
    options: {
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET'
      }
    }
  }
}

const DEFAULT_REPLY = { success: false }

module.exports.tellstickApi = async function tellstickApi (request) {
  const url = tellstick.parseAll(request)

  if (!url) {
    return { ...DEFAULT_REPLY, error: 'Unknown command!' }
  }

  const { method, options } = getHeaders(request)
  const promise = wreck.request(method, url, options)

  try {
    const res = await promise
    // json: 'strict' returns an error in case of none json resonse.
    const body = await Wreck.read(res, { json: 'strict' })

    return {
      success: !body.error,
      message: body.error ? undefined : body,
      error: body.error ? body.error : undefined
    }
  } catch (err) {
    return { ...DEFAULT_REPLY, error: err.message }
  }
}
