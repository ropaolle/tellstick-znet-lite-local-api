const Wreck = require('wreck')
let authorization = require('./authorization.json')

const method = 'GET' // GET, POST, PUT, DELETE
const uri = '/api/devices/list?supportedMethods=19'
// const readableStream = Wreck.toReadableStream('foo=bar')

const wreck = Wreck.defaults({
  headers: {
    authorization: `Bearer ${authorization.accessToken}`,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET'
  }
  // agents: {
  //   https: new Https.Agent({ maxSockets: 100 }),
  //   http: new Http.Agent({ maxSockets: 1000 }),
  //   httpsAllowUnauthorized: new Https.Agent({ maxSockets: 100, rejectUnauthorized: false })
  // }
})

// cascading example -- does not alter `wreck`
// inherits `headers` and `agents` specified above
// const wreckWithTimeout = wreck.defaults({
//   timeout: 5
// })

// all attributes are optional
const options = {
  baseUrl: 'http://192.168.10.104/'
  // payload: readableStream || 'foo=bar' || new Buffer('foo=bar'),
  // headers: { /* http headers */ }
  // redirects: 3,
  // beforeRedirect: (redirectMethod, statusCode, location, resHeaders, redirectOptions, next) => next(),
  // redirected: function (statusCode, location, req) {},
  // timeout: 1000, // 1 second, default: unlimited
  // maxBytes: 1048576, // 1 MB, default: unlimited
  // rejectUnauthorized: true || false,
  // downstreamRes: null,
  // agent: null, // Node Core http.Agent
  // secureProtocol: 'SSLv3_method', // The SSL method to use
  // ciphers: 'DES-CBC3-SHA' // The TLS ciphers to support
}

const example = async function () {
  const promise = wreck.request(method, uri, options)
  try {
    const res = await promise
    // console.log(res)
    const body = await Wreck.read(res)
    console.log(body.toString())
  } catch (err) {
    // Handle errors
  }
}

example()
