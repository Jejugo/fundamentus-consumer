import * as assets from '../lib/assets';
import Koa from 'koa';

export const getAllSectors = async (ctx: Koa.Context) => {
  const { uid } = ctx.state.user;
  ctx.body = await assets.getAllSectors(uid);
};
