const fs = require('fs')
const path = require('path')

const getVersions = () =>
  fs.readdirSync('./').filter(file => fs.statSync(path.join('./', file)).isDirectory() && file.startsWith('src'))

module.exports = getVersions().map(() => require('../src/routes'))