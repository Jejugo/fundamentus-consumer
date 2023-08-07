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
  ctx.body = await user.userRecommendationUpdate(uid);
};

export const getUserFundaments = async (ctx: Koa.Context) => {
  ctx.body = await user.getUserFundaments();
};

export const setUserFundaments = async (ctx: Koa.Context) => {
  const { body } = ctx.request;
  const { uid } = ctx.state.user;

  ctx.body = await user.setUserFundaments(body, uid);
};
