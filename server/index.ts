import config from '../configs';
import createServer from './create-server';
import dotenv from 'dotenv';

dotenv.config();
const app = createServer();

app.listen(config.PORT, () => console.info('server is running...'));
