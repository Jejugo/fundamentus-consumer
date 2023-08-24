import * as assets from '../lib/assets';
import Koa from 'koa';

export const getAllSectors = async (ctx: Koa.Context) => {
  const { uid } = ctx.state.user;
  ctx.body = await assets.getAllSectors(uid);
};
export const deleteAsset = async (ctx: Koa.Context) => {
  const { assetType, symbol } = ctx.params;
  const { uid } = ctx.state.user;
  ctx.body = await assets.deleteAsset(assetType, symbol, uid);
};
