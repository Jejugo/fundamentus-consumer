import Koa from 'koa';
import * as user from '../lib/user';

export const getStrategies = async (ctx: Koa.Context) => {
  const { uid } = ctx.state.user;
  if (uid) ctx.body = await user.getStrategies(uid);
  else
    ctx.body = {
      status: 401,
      message: `Unauthorized access`,
    };
};

export const getWalletRecommendation = async (ctx: Koa.Context) => {
  const { uid } = ctx.state.user;
  if (uid) ctx.body = await user.getWalletRecommendation(uid);
  else
    ctx.body = {
      status: 401,
      message: `Unauthorized access`,
    };
};

export const userRecommendationUpdate = async (ctx: Koa.Context) => {
  const { uid } = ctx.state.user;
  if (uid) ctx.body = await user.userRecommendationUpdate(uid);
  else
    ctx.body = {
      status: 401,
      message: `Unauthorized access`,
    };
};

export const getUserFundaments = async (ctx: Koa.Context) => {
  const { uid } = ctx.state.user;
  if (uid) ctx.body = ctx.body = await user.getUserFundaments();
  else
    ctx.body = {
      status: 401,
      message: `Unauthorized access`,
    };
};

export const setUserFundaments = async (ctx: Koa.Context) => {
  const { body } = ctx.request;
  const { uid } = ctx.state.user;

  ctx.body = await user.setUserFundaments(body, uid);
};

export const setUserAssetSectors = async (ctx: Koa.Context) => {
  const { uid } = ctx.state.user;
  const { body } = ctx.request;
  const { assetType } = ctx.params;

  if (uid && body) {
    const { item } = JSON.parse(body);
    ctx.body = await user.setAssetTypeSectors(uid, item, assetType);
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
    ctx.body = await user.deleteUserAssetSector(uid, itemId, assetType);
  } else
    ctx.body = {
      status: 401,
      message: `Unauthorized access`,
    };
};
