import config from '../configs';
import createServer from './create-server';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const app = createServer();

app.listen(config.PORT, () =>
  console.info(`server is running on port ${config.PORT}`),
);
