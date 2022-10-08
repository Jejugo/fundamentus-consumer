const Koa = require('koa');
const cors = require('@koa/cors');
const versions = require('./versions');

const options = {
  origin: '*',
};

const createServer = () => {
  const app = new Koa();
  app.use(versions[0].routes());
  app.use(cors(options));
  return app;
};

module.exports = createServer;
