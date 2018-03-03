var fs = require('fs')
var fileExists = require('file-exists')

const AUTH_PATH = `${__dirname}/auth.json`

// if(!fileExists(filename)){
//   fs.writeFileSync(filename, data);
// }

let auth = require('./auth.json')

// function updateAuth (body) {
//   fs.writeFile(AUTH_PATH, JSON.stringify({ ...auth, ...body }, null, 4), err => {
//     if (err) throw err
//   })
// }
