import redis from '../../server/redis';
const redisClient = redis.client;

const MAX_SCAN_COUNT = 500;

/**
 * @module lib/redisController
 * @method [lib/redisController] getAllKeysFromFolder()
 * @description Scan Redis from Keys of specific value
 * @param {Object}
 */
export const getAllKeysFromFolder = async ({
  folder,
  query = '*',
  cursor = 0,
  totalKeys = [],
  exactMatch = false,
}: any): Promise<any> => {
  const match = exactMatch
    ? query.replace(/ /g, '*')
    : `*${query.replace(/ /g, '*')}*`;

  const [cursorPosition, keys] = await redisClient.scanAsync(
    cursor,
    'MATCH',
    `${folder}:${match}`,
    'COUNT',
    MAX_SCAN_COUNT,
  );

  const newCursorPosition = parseInt(cursorPosition);
  // console.info(`Fetching keys for query: ${query} in folder: ${folder}`, {
  //   scope: 'Redis',
  // });
  if (newCursorPosition === 0) return [...keys, ...totalKeys];
  return getAllKeysFromFolder({
    folder,
    query,
    exactMatch,
    cursor: newCursorPosition,
    totalKeys: [...keys, ...totalKeys],
  });
};

/**
 * @module utils/redisClient
 * @method [utils/redisClient] getKeyValue
 * @description Returns a value from a redis key
 * @returns {Promise<Object>}
 * @param {String} folder
 * @param {String} key
 */
export const getKeyValue = (folder: string, key: string): Promise<any> =>
  new Promise((resolve, reject) => {
    redisClient.get(`${folder}:${key}`, (err: any, value: any) => {
      if (err) {
        console.error('Redis get an error on get method', key, {
          scope: 'Redis',
        });
        return reject(err);
      }
      // console.info(`Fetching values for ${folder}:${key}`, { scope: 'Redis' });
      resolve(JSON.parse(value) || '');
    });
  });