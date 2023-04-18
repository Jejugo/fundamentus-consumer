import * as fundamentusLib from '../lib/reits';
import Koa from 'koa';

export const fundamentusIndicators = async (
  ctx: Koa.Context,
): Promise<void> => {
  const { optimized = false } = ctx.query;
  ctx.body = await fundamentusLib.getFundamentusIndicators(
    optimized as boolean,
  );
};
