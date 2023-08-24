/* eslint-disable prettier/prettier */
import Router from 'koa-router';

import {
  shares,
  health,
  reits,
  user,
  assets,
  bonds,
  international,
  crypto,
} from './services';
import * as admin from 'firebase-admin';

const verifyFirebaseToken = async (ctx, next) => {
  const authHeader = ctx.headers.authorization;
  if (!authHeader) {
    ctx.status = 401;
    ctx.body = 'Unauthorized';
    return;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    ctx.state.user = decodedToken; // Attach the decoded token to Koa's state object
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = 'Invalid token';
  }
};

const setRoutes = (router: Router<any, any>) => {
  router.get('/health', health.get);

  router.get('/assets/all/sectors', verifyFirebaseToken, assets.getAllSectors);
  router.delete('/assets/:assetType/:symbol', verifyFirebaseToken, assets.deleteAsset)
  router.get('/shares', verifyFirebaseToken, shares.getShares);
  router.get('/shares/sectors', verifyFirebaseToken, shares.getSharesSectors);
  
  router.delete('/shares/:symbol', verifyFirebaseToken, shares.deleteShare);

  router.get('/reits', verifyFirebaseToken, reits.getReits);
  router.get('/reits/sectors', verifyFirebaseToken, reits.getReitsSectors);

  router.get('/bonds', verifyFirebaseToken, bonds.getBonds);
  router.get('/bonds/sectors', verifyFirebaseToken, bonds.getBondsSectors);
  router.delete('/bonds/:symbol', verifyFirebaseToken, bonds.deleteBond);

  router.get(
    '/international/assets',
    verifyFirebaseToken,
    international.getInternationalAssets,
  );
  router.get(
    '/international/sectors',
    verifyFirebaseToken,
    international.getInternationalSectors,
  );
  router.get('/crypto/sectors', verifyFirebaseToken, crypto.getCryptoSectors);

  router.get('/user/strategy', verifyFirebaseToken, user.getStrategies);
  router.get(
    '/user/recommendation',
    verifyFirebaseToken,
    user.getWalletRecommendation,
  );
  router.post(
    '`/user/stocks/fundaments`',
    verifyFirebaseToken,
    user.setUserFundaments,
  );
  router.get(
    '/user/stocks/fundaments',
    verifyFirebaseToken,
    user.getUserFundaments,
  );
  router.post(
    '/user/:assetType/sectors',
    verifyFirebaseToken,
    user.setUserAssetSectors,
  );
  router.delete(
    '/user/:assetType/sectors/:itemId',
    verifyFirebaseToken,
    user.deleteUserAssetSector,
  );
  router.post(
    '/sync/user/:id',
    verifyFirebaseToken,
    user.userRecommendationUpdate,
  );
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
