'use strict'

const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

const DATABASE_FILE = 'database.json'

const DEFAULT_DB = {
  port: 4000,
  app: {
    favorites: [],
    'authUrl': '',
    'requestToken': '',
    'expires': 0,
    'accessToken': '',
    'allowRenew': false
  }
}

// Create database instance
let adapter = null
let jsonDb = null

module.exports.init = async function init (filename, overwriteDb) {
  if (jsonDb === null) {
    adapter = new FileAsync(filename || DATABASE_FILE)
    jsonDb = await low(adapter).catch((err) => console.log('Error', err))

    // Create file and load defalts if db file is missing
    if (!overwriteDb) {
      // Only create new db if it don't exist
      jsonDb.defaults(DEFAULT_DB).write()
    } else {
      jsonDb.setState(overwriteDb).write()
    }
  }

  return jsonDb
}

module.exports.db = function db () {
  return jsonDb
}

// module.exports.get = (path) => {
//   return jsonDb.get(path).value()
// }
