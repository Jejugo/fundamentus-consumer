const config = require('../configs');
const createServer = require('./create-server');

const app = createServer();
app.listen(config.PORT, () => console.info('server is running...'));
