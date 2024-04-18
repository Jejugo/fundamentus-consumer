import Koa from 'koa';
import * as lib from '../lib/user';

export const getStrategies = async (ctx: Koa.Context) => {
  const { uid } = ctx.state.user;
  if (uid) ctx.body = await lib.getStrategies(uid);
  else
    ctx.body = {
      status: 401,
      message: `Unauthorized access`,
    };
};

export const getWalletRecommendation = async (ctx: Koa.Context) => {
  if (ctx?.state?.user?.uid) {
    ctx.body = await lib.getWalletRecommendation(ctx.state.user.uid);
  } else
    ctx.body = {
      status: 401,
      message: `Unauthorized access`,
    };
};

export const userRecommendationUpdate = async (ctx: Koa.Context) => {
  if (ctx?.state?.user?.uid) {
    ctx.body = await lib.userRecommendationUpdate(ctx.state.user.uid);
  } else
    ctx.body = {
      status: 401,
      message: `Unauthorized access`,
    };
};

// export const getUserFundaments = async (ctx: Koa.Context) => {
//   const { uid } = ctx.state.user;
//   if (uid) ctx.body = ctx.body = await lib.getUserFundaments();
//   else
//     ctx.body = {
//       status: 401,
//       message: `Unauthorized access`,
//     };
// };

// export const setUserFundaments = async (ctx: Koa.Context) => {
//   const { body } = ctx.request;
//   const { uid } = ctx.state.user;

//   ctx.body = await lib.setUserFundaments(body, uid);
// };

export const setUserAssetSectors = async (ctx: Koa.Context) => {
  const { uid } = ctx.state.user;
  const { body } = ctx.request;
  const { assetType } = ctx.params;

  if (uid && body) {
    const { item } = JSON.parse(body);
    ctx.body = await lib.setAssetTypeSectors(uid, item, assetType);
  } else
    ctx.body = {
      status: 401,
      message: `Unauthorized access`,
    };
};

export const deleteUserAssetSector = async (ctx: Koa.Context) => {
  const { uid } = ctx.state.user;
  const { itemId, assetType } = ctx.params;

  if (uid) {
    ctx.body = await lib.deleteUserAssetSector(uid, itemId, assetType);
  } else
    ctx.body = {
      status: 401,
      message: `Unauthorized access`,
    };
};
