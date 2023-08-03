import { promisify } from 'util';
import redis from '../../server/redis';
import Firestore from '../firebase';

const redisClient = redis.client;

export const getData = async (
  redisKey,
  firebaseCollection,
  userId,
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

  let items = {} as FirebaseFirestore.DocumentData | undefined;
  const docRef = Firestore.collection(firebaseCollection).doc(userId);
  await docRef
    .get()
    .then(docSnap => {
      if (docSnap.exists) {
        items = docSnap.data();
      } else {
        console.log('No such document!');
      }
    })
    .catch(error => {
      console.error('Error getting document:', error);
    });

  redisClient.set(redisKey, JSON.stringify(items), 'EX', 60 * 60 * 24); // cache for 24 hours

  return {
    fromRedis: false,
    items,
  };
};

export const setData = async (firebaseCollection, data, userId) => {
  const collectionRef = Firestore.collection(firebaseCollection);
  const batch = Firestore.batch();

  // Update each document in Firestore

  const docRef = collectionRef.doc(userId); // Assuming each item has an 'id' field
  batch.set(docRef, data); // Use 'set' to overwrite existing data. Use 'update' to update fields.

  // Commit the batch
  await batch.commit();

  // // Cache the data in Redis
  // const redisSetAsync = promisify(redisClient.set).bind(redisClient);
  // await redisSetAsync(redisKey, JSON.stringify(data), 'EX', 60 * 60 * 24); // cache for 24 hours

  return {
    fromFirebase: true,
    items: data,
  };
};
