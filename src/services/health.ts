import Koa from 'koa';

export const get = (ctx: Koa.Context) => {
  ctx.body = {
    status: true,
  };
};
