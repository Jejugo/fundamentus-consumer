import * as assets from '../lib/assets';
import Koa from 'koa';
export const getAllSectors = async (ctx: Koa.Context) => {
  ctx.body = await assets.getAllSectors();
};
