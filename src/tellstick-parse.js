'use strict'

/**
 * Constants
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

const SUPPORTED_METHODS = TELLSTICK_TURNON + TELLSTICK_TURNOFF + TELLSTICK_DIM
const INCLUDE_VALUES = 1

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
    default:
      return null
  }
}

/**
 * Sensor query's
 *
 * command: info
 */
function parseSensors ({ command, id }) {
  // List all sensors
  if (!id) {
    return `sensors/list?includeValues=${INCLUDE_VALUES}`
  }

  // Sensor commands
  switch (command) {
    case 'info':
      return `sensor/${command}?id=${id}`
    default:
      return null
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
    default:
      return null
  }
}

module.exports.parseAll = function (request) {
  // console.log('X', request)
  switch (request.type) {
    case 'devices':
      return parseDevices(request)
    case 'sensors':
      return parseSensors(request)
    case 'token':
      return parseTokens(request)
    default:
      return null
  }
}
