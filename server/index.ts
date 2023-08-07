import config from '../configs';
import createServer from './create-server';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config({ path: '.env' });

const app = createServer();

app.listen(config.PORT, () =>
  logger.info(`server is running on port ${config.PORT}`),
);
