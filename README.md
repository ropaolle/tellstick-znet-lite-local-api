# tellstick-znet-lite-local-api

## Version 17
[Getting started](https://github.com/sfabriece/hapijs.com/blob/aecc38766cf3c8e16e99e060b05d9c4e57bf0c7d/lib/tutorials/en_US/getting-started.md)
[Release notes](https://github.com/hapijs/hapi/issues/3658)
[API Referince](https://github.com/hapijs/hapi/blob/master/API.md)
[v16 to v17](https://futurestud.io/tutorials/hapi-v17-upgrade-guide-your-move-to-async-await)
[Route example](https://github.com/hapijs/discuss/issues/597)

## Eslint
drwxrwxr-x 3 ropaolle ropaolle 4096 jan 17 11:22 create-react-app
drwxrwxr-x 7 ropaolle ropaolle 4096 mar  1 13:34 eslint
drwxrwxr-x 7 ropaolle ropaolle 4096 jan 27 13:44 firebase-tools
drwxrwxr-x 5 ropaolle ropaolle 4096 jan  1 14:01 firestore-backup
drwxrwxr-x 8 ropaolle ropaolle 4096 feb 24 15:49 gh-pages
drwxrwxr-x 6 ropaolle ropaolle 4096 feb 19 09:58 jmate
drwxrwxr-x 7 ropaolle ropaolle 4096 jan 28 18:02 serve

npm i --save-dev eslint eslint-config-standard eslint-plugin-standard eslint-plugin-promise eslint-plugin-import eslint-plugin-node

{
  "extends": ["airbnb", "plugin:react/recommended"],
  "env": {
    "es6": true,
    "browser": true
  },
  "globals": {
    "it": true
  },
  "plugins": ["react"],
  "rules": {
    "react/forbid-prop-types": 0,
    "no-console": 1
  }
}
