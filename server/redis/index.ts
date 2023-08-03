import bluebird from 'bluebird';
/* eslint-disable @typescript-eslint/no-var-requires */
import redis from 'redis';

/* eslint-disable @typescript-eslint/no-explicit-any */
let client: any;
import REDIS_CONFIG from '../../configs';

const createClient = () => {
  const redisConfig = {
    host: REDIS_CONFIG.REDIS_HOST,
    port: REDIS_CONFIG.REDIS_PORT,
    REDIS_DB: REDIS_CONFIG.REDIS_DB,
    REDIS_SCAN_COUNT: REDIS_CONFIG.REDIS_SCAN_COUNT,
    REDIS_EXPIRE: REDIS_CONFIG.REDIS_DB,
    ...(REDIS_CONFIG.REDIS_PASSWORD
      ? {
          password: REDIS_CONFIG.REDIS_PASSWORD,
        }
      : {}),
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
