import Firestore from '../firebase';
import { IInternationalItem } from './interfaces';

export const internationalSectors = [
  'Stocks',
  'Reits',
  'Technology ETF',
  'Gaming ETF',
  'Medical ETF',
  'Dividends ETF',
  'Growth ETF',
  'S&P ETF',
  'Treasury',
];

export const getInternationalSectors = async () => {
  return {
    status: 200,
    message: 'Data Retrieved',
    items: internationalSectors,
  };
};

export const getInternationalAssets = async () => {
  const stocksRef = Firestore.collection('userInternational');
  const snapshot = await stocksRef.get();
  const international: IInternationalItem[] = [];

  if (snapshot.empty) {
    return {
      status: 404,
      message: 'No international assets found.',
    };
  }

  snapshot.forEach((doc: any) => {
    international.push(doc.data());
  });

  return {
    status: 200,
    message: 'Data retrieved.',
    length: international.length,
    items: international,
  };
};
