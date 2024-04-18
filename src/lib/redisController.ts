import logger from '../../server/logger';
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
  totalKeys = [] as string[],
  exactMatch = false,
}: {
  folder: string;
  query?: string;
  cursor?: number;
  totalKeys?: string[];
  exactMatch?: boolean;
}): Promise<string[]> => {
  const match = exactMatch
    ? query.replace(/ /g, '*')
    : `*${query.replace(/ /g, '*')}*`;

  const [cursorPosition, keys]: [string, string[]] =
    await redisClient.scanAsync(
      cursor,
      'MATCH',
      `${folder}:${match}`,
      'COUNT',
      MAX_SCAN_COUNT,
    );

  const newCursorPosition = parseInt(cursorPosition);

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
export const getKeyValue = (folder: string, key: string): Promise<JSON> =>
  new Promise((resolve, reject) => {
    redisClient.get(`${folder}:${key}`, (err: string, value: string) => {
      if (err) {
        logger.error(`Redis get an error on get method ${key}`);
        return reject(err);
      }

      logger.info(`Fetching values for ${folder}:${key}`, { scope: 'Redis' });
      resolve(JSON.parse(value) || '');
    });
  });
