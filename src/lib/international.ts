import Firestore from '../firebase';
import { IInternationalItem } from './interfaces';
import { getDataById } from '../commons/request';
import defaultSectors from '../const/defaultSectors.json';
import { uniqueArray } from '../builders/arrays';

// export const internationalSectors = [
//   'Stocks',
//   'Reits',
//   'Technology ETF',
//   'Gaming ETF',
//   'Medical ETF',
//   'Dividends ETF',
//   'Growth ETF',
//   'S&P ETF',
//   'Treasury',
// ];

export const getInternationalSectors = async (uid: string) => {
  const userSectorsInternational = await getDataById(
    'user:sectors:bonds',
    'userSectorsInternational',
    uid,
    true,
  );

  const defaultInternationalSectors = defaultSectors.international;

  return {
    status: 200,
    message: 'Data Retrieved',
    items: {
      international: uniqueArray([
        ...(userSectorsInternational.items?.values || []),
        ...defaultInternationalSectors,
      ]),
    },
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

  snapshot.forEach(doc => {
    international.push(doc.data());
  });

  return {
    status: 200,
    message: 'Data retrieved.',
    length: international.length,
    items: international,
  };
};
