let authorization = require('./authorization.json')

/**
 * Methods
 */
const TELLSTICK_TURNON = 1
const TELLSTICK_TURNOFF = 2
// const TELLSTICK_BELL = 4
// const TELLSTICK_TOGGLE = 8
const TELLSTICK_DIM = 16
// const TELLSTICK_LEARN = 32
// const TELLSTICK_EXECUTE = 64
// const TELLSTICK_UP = 128
// const TELLSTICK_DOWN = 256
// const TELLSTICK_STOP = 512

/**
 * Constants
 */
const SUPPORTED_METHODS = TELLSTICK_TURNON + TELLSTICK_TURNOFF + TELLSTICK_DIM
const INCLUDE_VALUES = 1

function getOptions ({ type, command }) {
  // Basic options
  let result = {
    method: 'GET',
    uri: '/api/',
    options: {
      baseUrl: 'http://192.168.10.104/',
      headers: {
        authorization: `Bearer ${authorization.accessToken}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET'
      }
    }
  }

  // Token options
  if (type === 'token') {
    if (command === 'new') {
      result.options.method = 'PUT'
      result.options.form = { app: 'tzll' }
      delete result.options.headers
    } else if (command === 'access') {
      delete result.options.headers
    }
  }

  return result
}

/**
 * Device query's
 *
 * command: turnOn|turnOff|dim|info|history
 * level: 0 - 255
 */
function parseDevices ({ command, id, level }) {
  // List all devices
  if (!id) {
    return `devices/list?supportedMethods=${SUPPORTED_METHODS}`
  }

  // Device commands
  switch (command) {
    case 'info':
      return `device/${command}?id=${id}&supportedMethods=${SUPPORTED_METHODS}`
    case 'dim':
      return level && `device/${command}?id=${id}&level=${level}`
    case 'turnOn':
    case 'turnOff':
    case 'history':
      return `device/${command}?id=${id}`
  }
}

/**
 * Sensor query's
 *
 * command: info
 */
function parseSensors ({ command, id, level }) {
  // List all sensors
  if (!id) {
    return `sensors/list?includeValues=${INCLUDE_VALUES}`
  }

  // Sensor commands
  switch (command) {
    case 'info':
      return `sensor/${command}?id=${id}`
  }
}

/**
 * Authentication query's
 *
 * type: new|access|refresh
 * token: {token}
 */
function parseTokens ({ command, token }) {
  switch (command) {
    case 'new':
      return `token`
    case 'access':
      return token && `token?token=${token}`
    case 'refresh':
      return `refreshToken`
    // case 'info':
    //   return `tokenInfo`
  }
}

function parseAll (request) {
  switch (request.type) {
    case 'devices':
      return parseDevices(request)
    case 'sensors':
      return parseSensors(request)
    case 'token':
      return parseTokens(request)
  }
}

module.exports.parse = function parse (request) {
  // const parsed = parseAll(request)
  const options = getOptions(request)
  options.uri = `/api/${parseAll(request)}`
  console.log(options)
  return 'options'
}
