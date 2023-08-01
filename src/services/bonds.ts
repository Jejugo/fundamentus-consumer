import * as bonds from '../lib/bonds';
import Koa from 'koa';
export const getBondsSectors = async (ctx: Koa.Context) => {
  ctx.body = await bonds.getBondsSectors();
};

export const getBonds = async (ctx: Koa.Context) => {
  ctx.body = await bonds.getBonds();
};

export const deleteBond = async (ctx: Koa.Context) => {
  const { symbol } = ctx.params;
  ctx.body = await bonds.deleteBond(symbol);
};
