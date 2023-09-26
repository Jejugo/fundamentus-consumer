import Firestore from '../firebase';
import * as filter from '../filters/shares';
import { IStockItem } from './interfaces';
import { promisify } from 'util';
import redis from '../../server/redis';
import { FieldValue } from 'firebase-admin/firestore';

const redisClient = redis.client;

export const getShares = async (optimized = false) => {
  try {
    const redisKey = optimized ? 'shares:optimized' : 'shares';
    const redisGetAsync = promisify(redisClient.get).bind(redisClient);

    const cachedData = await redisGetAsync(redisKey);

    if (cachedData && cachedData !== '[]') {
      return {
        status: 200,
        message: 'Data retrieved from Redis.',
        length: cachedData.length,
        items: JSON.parse(cachedData),
      };
    }

    const stocksRef = Firestore.collection('stocks');
    const snapshot = await stocksRef.get();
    const stocks: IStockItem[] = [];
    snapshot.forEach((doc: any) => {
      stocks.push(doc.data());
    });

    const items = optimized ? filter.basedOnValidation(stocks) : stocks;

    redisClient.set(redisKey, JSON.stringify(items), 'EX', 60 * 60 * 24); // cache for 24 hours

    return {
      status: 200,
      message: 'Data retrieved from Firebase.',
      length: items.length,
      items,
    };
  } catch (err) {
    if (err instanceof Error) console.error(err.message);
    return {
      status: 500,
      message: 'Error when retrieving data from Firebase',
    };
  }
};

export const getSharesSectors = async () => {
  const shares = await getShares();

  const sectors = [
    ...new Set(shares.items.map((shares: IStockItem) => shares['subsetor'])),
  ].filter(a => a);

  return {
    status: 200,
    message: 'Data Retrieved',
    length: sectors.length,
    items: sectors,
  };
};

export const deleteShare = async (symbol: string) => {
  const stocksRef = Firestore.collection('stocks');
  const query = stocksRef.where('symbol', '==', symbol);
  const snapshot = await query.get();

  if (snapshot.empty) {
    return {
      status: 404,
      message: 'Symbol not found',
    };
  }

  const batch = Firestore.batch();

  snapshot.forEach(doc => {
    batch.update(doc.ref, { [symbol]: FieldValue.delete() });
  });

  await batch.commit();

  return {
    status: 200,
    message: 'Item deleted',
  };
};
