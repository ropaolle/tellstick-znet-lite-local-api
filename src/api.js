const Wreck = require('wreck')
const tellstick = require('./tellstick')
let authorization = require('./authorization.json')

// const method = 'PUT' // GET
// const uri = '/api/devices/list?supportedMethods=19'
// const uri = '/api/token'

const wreck = Wreck.defaults({})

// const options = {
//   baseUrl: 'http://192.168.10.104/',
//   form: { app: 'tzll' }
//   // headers: {
//   //   authorization: `Bearer ${authorization.accessToken}`,
//   //   'Access-Control-Allow-Origin': '*',
//   //   'Access-Control-Allow-Methods': 'GET'
//   // }
// }

// if (['accessToken', 'requestToken'].includes(query.command)) {
//   delete options.headers
// }

const example = async function () {
  const { method, uri, options } = tellstick.parse({})

  const promise = wreck.request(method, uri, options)
  try {
    const res = await promise
    const body = await Wreck.read(res, { json: true })
    console.log(body)
  } catch (err) {
    // Handle errors
  }
}

example()
