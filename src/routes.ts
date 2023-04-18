import Router from 'koa-router';
import { shares, health, reits } from './services';

const setRoutes = (router: Router<any, {}>) => {
  router.get('/health', health.get);
  //sync information with fundamentus wesite
  router.get('/shares/sync', shares.fundamentusSync);
  //get shares indicators from fundamentus website
  router.get('/shares', shares.getShares);
  //get reits indicators from fundamentus website
  router.get('/fundamentus/reits/indicators', reits.fundamentusIndicators);
};

const createRouter = () => {
  const router = new Router();
  setRoutes(router);

  return router;
};

export default {
  routes: () => createRouter().routes(),
};
