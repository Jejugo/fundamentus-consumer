const Router = require('koa-router');
const service = require('./services');

const { shares, health } = service

const setRoutes = (router) => {
  router.get('/health', health.get)
  router.get('/goodShares', shares.goodShares)
  router.get('/shares', shares.allShares)
  router.get('/sharesSync', shares.fundamentusSync)
}

const createRouter = () => {
  const router = new Router
  setRoutes(router)

  return router
}

module.exports = {
  routes: () => createRouter().routes()
}