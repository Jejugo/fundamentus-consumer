const Router = require('koa-router');
const service = require('./services');

const { shares, health } = service;

const setRoutes = router => {
  router.get('/health', health.get);
  router.get('/shares/sync', shares.fundamentusSync); //sync information with fundamentus wesite
  router.get('/shares/indicators', shares.fundamentusIndicators); //get shares indicators from fundamentus website
  router.get('/shares/all', shares.fundamentusGetAllShares);
};

const createRouter = () => {
  const router = new Router();
  setRoutes(router);

  return router;
};

module.exports = {
  routes: () => createRouter().routes(),
};
