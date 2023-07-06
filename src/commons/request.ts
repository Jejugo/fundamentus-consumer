import { promisify } from 'util';
import redis from '../../server/redis';
import Firestore from '../firebase';

const redisClient = redis.client;

export const getData = async (
  redisKey,
  firebaseCollection,
  skipCache = false,
) => {
  if (!skipCache) {
    const redisGetAsync = promisify(redisClient.get).bind(redisClient);

    const cachedData = await redisGetAsync(redisKey);

    if (cachedData) {
      return {
        fromRedis: true,
        items: JSON.parse(cachedData),
      };
    }
  }

  const collectionRef = Firestore.collection(firebaseCollection);
  const snapshot = await collectionRef.get();
  const items: any = [];
  snapshot.forEach((doc: any) => {
    items.push(doc.data());
  });

  redisClient.set(redisKey, JSON.stringify(items), 'EX', 60 * 60 * 24); // cache for 24 hours

  return {
    fromRedis: false,
    items,
  };
};
