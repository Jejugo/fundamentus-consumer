import * as reits from '../lib/reits';
import Koa from 'koa';

export const getReits = async (ctx: Koa.Context) => {
  const { optimized = false } = ctx.query;

  ctx.type = 'application/json';
  ctx.body = await reits.getReits(!!optimized);
};

export const getReitsSectors = async (ctx: Koa.Context) => {
  ctx.type = 'application/json';
  ctx.body = await reits.getReitsSectors();
};
