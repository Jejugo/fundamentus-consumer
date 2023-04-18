import * as shareLib from '../lib/shares';
import Koa from 'koa';

export const fundamentusSync = async (ctx: Koa.Context): Promise<void> => {
  ctx.body = await shareLib.sync();
};
export const getShares = async (ctx: Koa.Context): Promise<void> => {
  const { optimized = false } = ctx.query;
  ctx.body = await shareLib.getShares(optimized as boolean);
};

export const getSheetData = async (ctx: Koa.Context) => {
  const { assetType } = ctx.params;
  const sheetStocks = await shareLib.getSheetStocks(assetType);

  ctx.body = {
    status: 200,
    message: 'Data successfully retrieved',
    items: sheetStocks,
  };
};
