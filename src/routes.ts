import Router from 'koa-router';
import cors from '@koa/cors';
import { bodyParser } from '@koa/bodyparser';
import {
  shares,
  health,
  reits,
  user,
  assets,
  bonds,
  international,
} from './services';

const options = {
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'], // the allowed methods in your API
  allowHeaders: '*',
  credentials: false,
};

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

  router.get('/user/strategy/:userId', user.getStrategies);
  router.get('/user/recommendation/:userId', user.getWalletRecommendation);
  router.post('/user/stocks/fundaments/:userId', user.setUserFundaments);
  router.get('/user/stocks/fundaments', user.getUserFundaments);
  router.post('/sync/user/:id', user.userRecommendationUpdate);
};

const createRouter = () => {
  const router = new Router();
  router.use(async (ctx, next) => {
    console.log('Request Origin:', ctx.request.origin);
    console.log('Request URL:', ctx.request.url);
    console.log('Request Method:', ctx.request.method);
    console.log('Query Parameters:', ctx.request.query);
    await next();
  });
  router.use(cors(options));
  router.use(bodyParser());

  setRoutes(router);

  return router;
};

const appRouter = createRouter();

export default {
  routes: () => appRouter.routes(),
};
