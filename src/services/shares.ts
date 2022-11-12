import * as fundamentusLib from '../lib/fundamentus/shares';
import Koa from 'koa';

export const fundamentusSync = async (ctx: Koa.Context): Promise<void> => {
  ctx.body = await fundamentusLib.sync();
};
export const fundamentusIndicators = async (
  ctx: Koa.Context,
): Promise<void> => {
  const { optimized = false } = ctx.query;
  ctx.body = await fundamentusLib.getFundamentusIndicators(
    optimized as boolean,
  );
};

export const getSheetData = async (ctx: Koa.Context) => {
  const { assetType } = ctx.params;
  const sheetStocks = await fundamentusLib.getSheetStocks(assetType);

  ctx.body = {
    status: 200,
    message: 'Data successfully retrieved',
    items: sheetStocks,
  };
};

export const fundamentusGetAllShares = async (
  ctx: Koa.Context,
): Promise<void> => {
  const { optimized = false } = ctx.query;
  const fundamentusStocks = await fundamentusLib.getFundamentusIndicators(
    optimized as boolean,
  );
  const sheetStocks = await fundamentusLib.getSheetStocks('shares');
  let mergeData: any = [];
  if (fundamentusStocks && sheetStocks) {
    mergeData = fundamentusLib.mergeStockData(
      fundamentusStocks.items,
      sheetStocks,
    );
  }
  ctx.body = {
    status: 200,
    message: 'Data successfully retrieved',
    items: mergeData,
  };
};
