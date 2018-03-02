Local api/proxy to Tellstick Znet Lite.

Tellstick is an IOT gateway that I use to control the lights in my apartment. It can be controlled by Tellstick's mobile/web client thru the service Tellstick Live. Unfortunately it won't work if my internet connection is down. To make sure I can handle my lights independent on internal I maid a local client ([Tellstick Znet Lite Local Client](https://github.com/ropaolle/tellstick-znet-lite-local)) and a proxy/api ([Tellstick Znet Lite Local Proxy/Api](https://github.com/ropaolle/tellstick-znet-lite-local-api)) that talks to the Tellstick.

[![Build Status](https://travis-ci.org/ropaolle/tellstick-znet-lite-local-api.svg?branch=master)](https://travis-ci.org/ropaolle/tellstick-znet-lite-local-api)
[![Codebeat Badge](https://codebeat.co/badges/3f625aac-2701-41b1-954b-a83baf42ab2e)](https://codebeat.co/projects/github-com-ropaolle-tellstick-znet-lite-local-api-master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c589a35dd9af482ebf790b20592a6115)](https://www.codacy.com/app/ropaolle/tellstick-znet-lite-local-api?utm_source=github.com&utm_medium=referral&utm_content=ropaolle/tellstick-znet-lite-local-api&utm_campaign=Badge_Grade)
[![David badge](https://david-dm.org/ropaolle/tellstick-znet-lite-local-api.svg)](https://david-dm.org/ropaolle/tellstick-znet-lite-local-api)
[![DevDependencies](https://img.shields.io/david/dev/ropaolle/tellstick-znet-lite-local-api.svg)](https://david-dm.org/ropaolle/tellstick-znet-lite-local-api#info=devDependencies&view=list)
[![Known Vulnerabilities](https://snyk.io/test/github/ropaolle/tellstick-znet-lite-local-api/badge.svg)](https://snyk.io/test/github/ropaolle/tellstick-znet-lite-local-api)

# Tellstick

* [Blogg - Tellstick Local API](http://developer.telldus.com/blog/2016/05/24/local-api-for-tellstick-znet-lite-beta-now-in-public-beta)
* [Ollenet API access](http://192.168.10.104/api)
* [API Explorer](http://api.telldus.com/explore/index)
* [API flags](http://developer.telldus.se/doxygen/group__core.html#gaa732c3323e53d50e893c43492e5660c9) [extras](https://github.com/telldus/telldus/blob/master/examples/python/live/tdtool/tdtool.py)

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
* [Release notes](https://github.com/hapijs/hapi/issues/3658)
* [API Referince](https://github.com/hapijs/hapi/blob/master/API.md)
* [v16 to v17](https://futurestud.io/tutorials/hapi-v17-upgrade-guide-your-move-to-async-await)
* [Route example](https://github.com/hapijs/discuss/issues/597)

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
