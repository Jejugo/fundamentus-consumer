import Koa from 'koa';
import * as user from '../lib/user';

export const getStrategies = async (ctx: Koa.Context) => {
  const { userId } = ctx.params;
  if (userId) ctx.body = await user.getStrategies(userId);
  else
    ctx.body = {
      status: 401,
      message: `Unauthorized access`,
    };
};

export const getWalletRecommendation = async (ctx: Koa.Context) => {
  const { userId } = ctx.params;
  if (userId) ctx.body = await user.getWalletRecommendation(userId);
  else
    ctx.body = {
      status: 401,
      message: `Unauthorized access`,
    };
};

export const userRecommendationUpdate = async (ctx: Koa.Context) => {
  const { id } = ctx.params;
  ctx.body = await user.userRecommendationUpdate(id);
};

export const getUserFundaments = async (ctx: Koa.Context) => {
  ctx.body = await user.getUserFundaments();
};

export const setUserFundaments = async (ctx: Koa.Context) => {
  const { body } = ctx.request;
  const { userId } = ctx.params;

  ctx.body = await user.setUserFundaments(body, userId);
};
