import Koa from 'koa';
import routes from '../src/routes';

const createServer = (): Koa<Koa.DefaultState, Koa.DefaultContext> => {
  const app: Koa = new Koa();

  app.use(routes.routes());

  return app;
};

export default createServer;
