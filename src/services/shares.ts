import * as fundamentusLib from '../lib/fundamentus/shares';
import Koa from 'koa';

const fundamentusSync = async (ctx: Koa.Context): Promise<void> => {
  ctx.body = await fundamentusLib.sync();
};
const fundamentusIndicators = async (ctx: Koa.Context): Promise<void> => {
  const { optimized = false } = ctx.query;
  ctx.body = await fundamentusLib.getFundamentusIndicators(
    optimized as boolean,
  );
};

const fundamentusGetAllShares = async (ctx: Koa.Context): Promise<void> => {
  const { optimized = false } = ctx.query;
  const fundamentusStocks = await fundamentusLib.getFundamentusIndicators(
    optimized as boolean,
  );
  const sheetStocks = await fundamentusLib.getSheetStocks();
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

module.exports = {
  fundamentusIndicators,
  fundamentusSync,
  fundamentusGetAllShares,
};
