import Koa from 'koa';
import cors from '@koa/cors';
import routes from '../src/routes';

const options = {
  origin: '*',
};

const createServer = (): Koa<Koa.DefaultState, Koa.DefaultContext> => {
  const app: Koa = new Koa();
  app.use(routes.routes());
  app.use((ctx: Koa.Context) => cors(options));

  return app;
};

export default createServer;
