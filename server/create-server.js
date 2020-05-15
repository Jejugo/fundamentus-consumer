const Koa = require('koa');
const versions = require('./versions')

const createServer = () => {
  const app = new Koa();
  app.use(versions[0].routes())

  return app
}

module.exports = createServer