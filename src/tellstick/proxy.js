'use strict'

const Wreck = require('wreck')
const Querystring = require('querystring')
const tellstick = require('./parse')
const { db } = require('../database')

const wreck = Wreck.defaults({
  timeout: 1000,
  baseUrl: 'http://192.168.10.104/api/'
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

const DEFAULT_REPLY = { success: false, error: null, message: null }

module.exports.tellstickApi = async function tellstickApi (request) {
  const url = tellstick.parseAll(request)

  // console.log('tellstickApi', url, request, accessToken)
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
      message: body.error ? null : body,
      error: body.error ? body.error : null
    }
  } catch (err) {
    return { ...DEFAULT_REPLY, error: err.message }
  }
}
