## Todo

* [ ] Store history someware else, firestore?
* [ ] Add history to client (prod + demo)
* [ ] Sparklines https://github.com/borisyankov/react-sparklines



## Tellstick

* [Blogg - Tellstick Local API](http://developer.telldus.com/blog/2016/05/24/local-api-for-tellstick-znet-lite-beta-now-in-public-beta)
* [Ollenet API access](http://192.168.10.104/api)
* [API Explorer](http://api.telldus.com/explore/index)
* [API flags](http://developer.telldus.se/doxygen/group__core.html#gaa732c3323e53d50e893c43492e5660c9)
* [GitHub](https://github.com/telldus/telldus/blob/master/examples/python/live/tdtool/tdtool.py)

## Get token

Local api access requiers an access token ([get new token](http://api.telldus.net/localapi/api.html)).

```bash
# 1. Get request token
curl -i -d app="ropaolle-sovrum" -X PUT http://192.168.10.104/api/token

# 2. Thru the link from step 1

# 3. Exchange the request token for an access token
curl -i -X GET http://192.168.10.104/api/token?token=a22a3d498a0d4304b09bf2f2dc7c61b4

# 4. Refresh access token
curl -i -X GET http://0.0.0.0/api/refreshToken -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImF1ZCI6IkV4YW1wbGUgYXBwIiwiZXhwIjoxNDUyOTUxNTYyfQ.eyJyZW5ldyI6dHJ1ZSwidHRsIjo4NjQwMH0.HeqoFM6-K5IuQa08Zr9HM9V2TKGRI9VxXlgdsutP7sg"
```

## HAPI Version 17

* [Getting started](https://github.com/sfabriece/hapijs.com/blob/aecc38766cf3c8e16e99e060b05d9c4e57bf0c7d/lib/tutorials/en_US/getting-started.md)
* [Release notes V17](https://github.com/hapijs/hapi/issues/3658)
* [API Referince](https://github.com/hapijs/hapi/blob/master/API.md)
* [Plugins](https://hapijs.com/tutorials/plugins?lang=en_US)
* [Lab - Test framework](https://github.com/hapijs/lab)
* [Code - Assertion](https://github.com/hapijs/code/blob/master/API.md)

# PM2

* [Info](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)

```bash
# Install
sudo npm install -g pm2

# Start
cd /home/olle/tellstick-znet-lite-local-api && pm2 start app.js

# Add to auto start
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin /home/olle/.npm-global/lib/node_modules/pm2/bin/pm2 startup systemd -u olle --hp /home/olle

# pm2 start/stop/restart/status/kill all
```

### Code examples

```javascript
// Save data
db
  .get("app.favorites")
  .push(666)
  .write();
db
  .get("app")
  .assign({ expires: 0 })
  .write();
db.set("app.expires", 666).write();

// HAPI log
server.events.on("log", (event, tags) => {
  if (tags.error) {
    console.log(`HAPI error: ${event.error ? event.error.message : "unknown"}`);
  } else {
    console.log(`HAPI info: ${JSON.stringify(event.data)}`);
  }
});

// Generate log from route
request.server.log("info", result);

// Validate
const Joi = require("joi");

// Route config
config: {
  validate: {
    params: {
      // or query
      version: Joi.string()
        .min(2)
        .max(3);
    }
  }
}
```

