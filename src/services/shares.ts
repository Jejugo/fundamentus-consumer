import * as shares from '../lib/shares';
import Koa from 'koa';

export const getShares = async (ctx: Koa.Context) => {
  const { optimized = false } = ctx.query;

  ctx.type = 'application/json';
  ctx.body = await shares.getShares(!!optimized);
};

export const getSharesSectors = async (ctx: Koa.Context) => {
  ctx.type = 'application/json';
  ctx.body = await shares.getSharesSectors();
};

export const deleteShare = async (ctx: Koa.Context) => {
  const { symbol } = ctx.params;
  ctx.type = 'application/json';
  ctx.body = await shares.deleteShare(symbol);
};
