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

/**
 * Device query's
 *
 * command: turnOn|turnOff|dim|info|history
 * id: number
 * level: 0 - 255
 */
function parseDevices ({ command, id, level }) {
  // List all devices
  if (!id) {
    return `devices/list?supportedMethods=${SUPPORTED_METHODS}&includeIgnored=1`
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
  }
}

/**
 * Sensor query's
 *
 * command: list|info
 * id: number
 */
function parseSensors ({ command, id }) {
  // List all sensors
  if (!id) {
    return `sensors/list?includeIgnored=1&includeValues=1` // &includeScale=1&includeUnit=1
  }

  // Sensor commands
  switch (command) {
    case 'info':
      return `sensor/${command}?id=${id}` // &includeUnit=1
    default:
  }
}

/**
 * Authentication query's
 *
 * type: new|access|refresh
 * requestToken: {token}
 */
function parseTokens ({ command, requestToken }) {
  switch (command) {
    case 'new':
      return `token`
    case 'access':
      return requestToken && `token?token=${requestToken}`
    case 'refresh':
      return `refreshToken`
    default:
  }
}

module.exports.parseAll = function (request) {
  switch (request.type) {
    case 'devices':
      return parseDevices(request)
    case 'sensors':
      return parseSensors(request)
    case 'token':
      return parseTokens(request)
    default:
  }
}
