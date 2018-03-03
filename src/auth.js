'use strict'

const fs = require('fs')
let auth = require('./auth.json')

const AUTH_PATH = `${__dirname}/auth.json`

function updateToken (data) {
  const content = {
    ...auth,
    ...data,
    updated: Date.now
  }

  fs.writeFile(AUTH_PATH, JSON.stringify(content, null, 4), err => {
    if (err) throw err
  })
}

module.exports.tokens = auth
module.exports.updateToken = updateToken
