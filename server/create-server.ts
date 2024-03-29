import Koa from 'koa';
import routes from '../src/routes';
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
  app.use(routes.routes());

  return app;
};

export default createServer;
