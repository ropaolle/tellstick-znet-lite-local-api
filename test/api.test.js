// 'use strict'

// Test framework https://github.com/hapijs/lab
const { experiment, it } = (exports.lab = require('lab').script())
// Assertion https://github.com/hapijs/code/blob/master/API.md
const { expect } = require('code')

const server = require('../src/server')
// const tellstick = require('../src/tellstick-api')

const requestDefaults = {
  method: 'GET',
  url: '/v1/devices'
}
console.log('T', process.env.NODE_ENV)
experiment('Getting started with hapi testing', () => {
  it('Dummy test', () => {
    expect(1 + 1).to.equal(2)
  })

  it('Call server', async () => {
    const request = Object.assign({}, requestDefaults)

    await server.inject(request)
      .then(response => {
        expect(response.statusCode).to.equal(200)
        console.log('RESULT', response.result)
        console.log('STATUS', response.statusCode)
        console.log('REQUEST', request)
      })
    console.log('A2')
  })
})

experiment('Server', () => {

})

// it('Call server', async () => {
//   const request = Object.assign({}, requestDefaults)
//   console.log('A1')

//   const a = await server.inject(request)
//     .then(response => {
//       console.log(response.statusCode, response.result)
//       console.log(request)
//     // t.is(response.statusCode, 400, 'status code is 400')
//     // done()
//     })

//   console.log('A3', a)
//   return false
// })
// })

// it('returns true when 1 + 1 equals 2', async () => {
//   const r = await tellstick.callApi({ type: 'token', command: 'new' })
//   console.log('IT', r)
//   expect(1 + 1).to.equal(2)
// })
