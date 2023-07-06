import { FieldValue } from 'firebase-admin/firestore';
import Firestore from '../firebase';

export const bondSectors = [
  'Tesouro Direto',
  'CDB',
  'LCI',
  'LCA',
  'Debentures',
  'CRI',
  'CRA',
  'Letra Financeira',
];

export const getBondsSectors = async () => {
  return {
    status: 200,
    message: 'Data Retrieved',
    items: bondSectors,
  };
};

export const deleteBond = async (symbol: string) => {
  const stocksRef = Firestore.collection('userBonds');
  const query = stocksRef.where(symbol, '!=', null);
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
