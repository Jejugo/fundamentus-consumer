import { getDataById } from '../commons/request';
import defaultSectors from '../const/defaultSectors.json';
import { uniqueArray } from '../builders/arrays';

// export const cryptosectors = [
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

export const getCryptoSectors = async (uid: string) => {
  const userSectorsCrypto = await getDataById(
    'user:sectors:crypto',
    'userSectorsCrypto',
    uid,
    true,
  );

  const defaultCryptoSectors = defaultSectors.crypto;

  return {
    status: 200,
    message: 'Data Retrieved',
    items: {
      crypto: uniqueArray([
        ...(userSectorsCrypto.items?.values || []),
        ...defaultCryptoSectors,
      ]),
    },
  };
};
