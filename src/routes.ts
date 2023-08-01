import Router from 'koa-router';
import cors from '@koa/cors';
import {
  shares,
  health,
  reits,
  user,
  assets,
  bonds,
  international,
} from './services';

const setRoutes = (router: Router<any, any>) => {
  router.get('/health', health.get);
  router.get('/assets/all/sectors', assets.getAllSectors);

  router.get('/shares', shares.getShares);
  router.get('/shares/sectors', shares.getSharesSectors);
  router.delete('/shares/:symbol', shares.deleteShare);

  router.get('/reits', reits.getReits);
  router.get('/reits/sectors', reits.getReitsSectors);

  router.get('/bonds', bonds.getBonds);
  router.get('/bonds/sectors', bonds.getBondsSectors);
  router.delete('/bonds/:symbol', bonds.deleteBond);

  router.get('/international/assets', international.getInternationalAssets);
  router.get('/international/sectors', international.getInternationalSectors);

  router.get('/user/strategy', user.getStrategies);
  router.get('/user/recommendation', user.getWalletRecommendation);
  router.post('/sync/user/:id', user.userRecommendationUpdate);
};

const createRouter = () => {
  const router = new Router();
  router.use(cors());
  setRoutes(router);

  return router;
};

const appRouter = createRouter();
appRouter.use(appRouter.routes()).use(appRouter.allowedMethods());

export default {
  routes: () => appRouter.routes(),
};
