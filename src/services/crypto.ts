import * as crypto from '../lib/crypto';
import Koa from 'koa';

export const getCryptoSectors = async (ctx: Koa.Context) => {
  const { uid } = ctx.state.user;
  ctx.body = await crypto.getCryptoSectors(uid);
};
