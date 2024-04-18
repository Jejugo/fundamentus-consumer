import Koa from 'koa';
import router from '../src/router';
import cors from '@koa/cors';
import koaBody from 'koa-body';

const options = {
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'], // the allowed methods in your API
  allowHeaders: '*',
};

const createServer = (): Koa<Koa.DefaultState, Koa.DefaultContext> => {
  const app: Koa = new Koa();
  app.use(koaBody());
  app.use(cors(options));
  app.use(router.routes());

  return app;
};

export default createServer;
