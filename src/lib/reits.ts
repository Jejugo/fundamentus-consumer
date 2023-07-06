import { promisify } from 'util';
import Firestore from '../firebase';
import * as filter from '../filters/reits';
import redis from '../../server/redis';
import { IReitItem } from './interfaces';

const redisClient = redis.client;

export const getReits = async (optimized = false) => {
  const redisKey = optimized ? 'reits:optimized' : 'reits';
  const redisGetAsync = promisify(redisClient.get).bind(redisClient);

  const cachedData = await redisGetAsync(redisKey);

  if (cachedData) {
    return {
      status: 200,
      message: 'Data retrieved from Redis.',
      length: cachedData.length,
      items: JSON.parse(cachedData),
    };
  }

  const stocksRef = Firestore.collection('reits');
  const snapshot = await stocksRef.get();
  const reits: IReitItem[] = [];

  snapshot.forEach((doc: any) => {
    reits.push(doc.data());
  });

  const items = optimized ? filter.basedOnValidation(reits) : reits;

  redisClient.set(redisKey, JSON.stringify(items), 'EX', 60 * 60 * 24); // cache for 24 hours

  return {
    status: 200,
    message: 'Data retrieved from Firebase.',
    length: items.length,
    items,
  };
};

export const getReitsSectors = async () => {
  const reits = await getReits();

  const sectors = [
    ...new Set(reits.items.map((reit: IReitItem) => reit['segmento'])),
  ].filter(a => a);

  return {
    status: 200,
    message: 'Data Retrieved',
    length: sectors.length,
    items: sectors,
  };
};
