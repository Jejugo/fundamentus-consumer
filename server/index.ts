import config from '../configs';
import createServer from './create-server';

const app = createServer();

app.listen(config.PORT, () => console.info('server is running...'));
