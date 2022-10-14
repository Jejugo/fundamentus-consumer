import bluebird from 'bluebird';
const redis = require('redis');

let client: any;

const createClient = () => {
  const {
    REDIS_HOST,
    REDIS_PORT,
    REDIS_DB,
    REDIS_SCAN_COUNT,
    REDIS_EXPIRE,
    REDIS_PASSWORD,
  } = require('../../configs');
  const redisConfig = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    REDIS_DB,
    REDIS_SCAN_COUNT,
    REDIS_EXPIRE,
  };

  bluebird.promisifyAll(redis.RedisClient.prototype);
  bluebird.promisifyAll(redis.Multi.prototype);

  console.info('starting Redis...', JSON.stringify(redisConfig));
  client = redis.createClient(redisConfig);
  client.on('error', (err: Error) =>
    console.error('error starting redis: ', err),
  );

  return client;
};

/*
 * const createTestClient = () => {
 *   const redisMock = require('redis-mock')
 *   bluebird.promisifyAll(redisMock.RedisClient.prototype)
 *   bluebird.promisifyAll(redisMock.Multi.prototype)
 */

/*
 *   client = redisMock.createClient()
 *   return client
 * }
 */

export default {
  get client() {
    return client || createClient();
  },
};
