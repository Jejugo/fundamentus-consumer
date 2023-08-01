import Koa from 'koa';
import * as user from '../lib/user';

export const getStrategies = async (ctx: Koa.Context) => {
  ctx.body = await user.getStrategies();
};

export const getWalletRecommendation = async (ctx: Koa.Context) => {
  ctx.body = await user.getWalletRecommendation();
};

export const userRecommendationUpdate = async (ctx: Koa.Context) => {
  const { id } = ctx.params;
  ctx.body = await user.userRecommendationUpdate(id);
};
