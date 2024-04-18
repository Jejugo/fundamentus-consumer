/* eslint-disable prettier/prettier */
import Router from 'koa-router';

import {
  setAssetRoutes,
  setBondRoutes,
  setCryptoRoutes,
  setHealthRoutes,
  setInternationalRoutes,
  setReitRoutes,
  setShareRoutes,
  setUserRoutes,
} from './routes';

const setRoutes = (router: Router) => {
  setHealthRoutes(router);
  setAssetRoutes(router);
  setShareRoutes(router);
  setReitRoutes(router);
  setBondRoutes(router);
  setInternationalRoutes(router);
  setCryptoRoutes(router);
  setUserRoutes(router);
};

const createRouter = () => {
  const router = new Router();

  setRoutes(router);

  return router;
};

const appRouter = createRouter();

export default {
  routes: () => appRouter.routes(),
};
