import Router from 'koa-router';
import { shares, health } from './services';

const setRoutes = (router: Router<any, {}>) => {
  router.get('/health', health.get);
  //sync information with fundamentus wesite
  router.get('/shares/sync', shares.fundamentusSync);
  //get shares indicators from fundamentus website
  router.get('/shares/indicators', shares.fundamentusIndicators);
  //get shares indicators from fundamentus website and merge with with csv sheet.
  router.get('/shares/all', shares.fundamentusGetAllShares);
};

const createRouter = () => {
  const router = new Router();
  setRoutes(router);

  return router;
};

export default {
  routes: () => createRouter().routes(),
};
