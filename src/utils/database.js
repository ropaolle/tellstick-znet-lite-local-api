'use strict'

const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

const DATABASE_FILE = './database/database.json'

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

let adapter
let jsonDb

module.exports.init = async function init (filename) {
  if (!jsonDb) {
    adapter = new FileAsync(filename || DATABASE_FILE)
    jsonDb = await low(adapter).catch((err) => console.log('Error', err))

    // Save defalts if db file is missing
    jsonDb.defaults(DEFAULT_DB).write()
  }

  return jsonDb
}

module.exports.db = function db () {
  return jsonDb
}
