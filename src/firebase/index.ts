import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { ServiceAccount } from 'firebase-admin';
import config from './config';

const initializeFirebase = () => {
  initializeApp({
    credential: cert(config as ServiceAccount),
  });

  const db = getFirestore();
  return db;
};

export default initializeFirebase();
