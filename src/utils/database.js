'use strict'

const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

const DATABASE_FILE = './database/database.json'

const DEFAULT_DB = {
  port: 4000,
  app: {
    favorites: [],
    maxMin: {},
    'authUrl': '',
    'requestToken': '',
    'expires': 0,
    'accessToken': '',
    'allowRenew': false
  },
  history: {}
}

let adapter
let jsonDb

module.exports.init = async function init (filename, defaultDb) {
  if (!jsonDb) {
    adapter = new FileAsync(filename || DATABASE_FILE)
    jsonDb = await low(adapter).catch((err) => console.log('Error jsonDb', err))

    if (!defaultDb) {
      // Create file and load defalts if db file is missing
      jsonDb.defaults(DEFAULT_DB).write()
    } else {
      // Overwrite db, used by tests
      jsonDb.setState(defaultDb).write()
    }
  }

  return jsonDb
}

module.exports.db = function db () {
  return jsonDb
}
