import Koa from 'koa';
import * as user from '../lib/user';

export const getStrategies = async (ctx: Koa.Context) => {
  ctx.body = await user.getStrategies();
};

export const getWalletRecommendation = async (ctx: Koa.Context) => {
  ctx.body = await user.getWalletRecommendation();
};
