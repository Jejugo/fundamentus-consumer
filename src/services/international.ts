import * as international from '../lib/international';
import Koa from 'koa';
export const getInternationalSectors = async (ctx: Koa.Context) => {
  ctx.body = await international.getInternationalSectors();
};