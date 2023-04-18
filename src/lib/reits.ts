import * as filter from '../filters/shares';
import { getReitsFromFundamentus } from '../integration/reits';
import * as redisController from './redisController';
import { IGetResponse, IStockItem } from './interfaces';

import redis from '../../server/redis';

const redisClient = redis.client;

const folder = 'shares';

/**
 * @module lib/shares
 * @method [lib/shares] checkSharesOnCacheAndFundamentus()
 * @description Check if there is data on Redis if not go to Fundamentus
 * @returns {String[]}
 */
export const checkSharesOnCacheAndFundamentus = async () => {
  const redisData: string[] | null = await redisController.getAllKeysFromFolder(
    {
      folder,
    },
  );
  // if (redisData) {
  //   const shareValues: IFundamentusStockItem[] = await Promise.all(
  //     redisData.map((key: string) =>
  //       redisController.getKeyValue(folder, key.replace(`${folder}:`, '')),
  //     ),
  //   );

  //   console.info('getting data from Redis and filtering good data...');
  //   return shareValues;
  // }

  return getReitsFromFundamentus();
};

export const getFundamentusIndicators = async (
  optimized: boolean,
): Promise<IGetResponse<IStockItem[]>> => {
  try {
    const shares = await checkSharesOnCacheAndFundamentus();
    return {
      status: 200,
      message: 'Data retrieved from Redis.',
      items: optimized ? filter.basedOnValidation(shares) : shares,
    };
  } catch (err) {
    throw new Error(`Cannot retrieve data from api or Redis: ${err}`);
  }
};
