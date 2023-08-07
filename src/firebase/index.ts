import { initializeApp, cert } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { ServiceAccount } from 'firebase-admin';
import config from './config';

let firebaseInstance: Firestore | null = null;

const initializeFirebase = () => {
  if (!firebaseInstance) {
    initializeApp({
      credential: cert(config as ServiceAccount),
    });

    firebaseInstance = getFirestore();
  }

  return firebaseInstance;
};

export default initializeFirebase();
