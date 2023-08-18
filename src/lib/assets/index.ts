import { IReitItem, IStockItem } from '../interfaces';

import { getReits } from '../reits';
import { getShares } from '../shares';
import { getDataById } from '../../commons/request';
import defaultSectors from '../../const/defaultSectors.json';
import { v4 as uuidv4 } from 'uuid';
import { uniqueArray } from '../../builders/arrays';

interface Sector {
  id: number;
  name: string;
  default: boolean;
}

export const getAllSectors = async (uid: string) => {
  try {
    const reits = await getReits();
    const stocks = await getShares();

    const reitSectors: Sector[] = uniqueArray(
      reits.items.map((reit: IReitItem) => ({
        id: uuidv4(),
        name: reit['segmento'],
        default: true,
      })),
    ).filter(a => a.name);

    const stockSectors: Sector[] = uniqueArray(
      stocks.items.map((stock: IStockItem) => ({
        id: uuidv4(),
        name: stock['subsetor'],
        default: true,
      })),
    ).filter(a => a.name);

    const [
      userSectorsBonds,
      userSectorsInternational,
      userSectorsCrypto,
      userSectorsOverview,
    ] = await Promise.all([
      await getDataById('user:sectors:bonds', 'userSectorsBonds', uid, true),
      await getDataById(
        'user:sectors:bonds',
        'userSectorsInternational',
        uid,
        true,
      ),
      await getDataById('user:sectors:crypto', 'userSectorsCrypto', uid, true),
      await getDataById(
        'user:sectors:overview',
        'userSectorsOverview',
        uid,
        true,
      ),
    ]);

    const defaultCryptoSectors = defaultSectors.crypto;
    const defaultInternationalSectors = defaultSectors.international;
    const defaultBondSectors = defaultSectors.bonds;
    const overviewSectors = defaultSectors.overview;

    return {
      status: 200,
      message: 'Data Retrieved',
      items: {
        stocks: stockSectors,
        reits: reitSectors,
        bonds: uniqueArray([
          ...(userSectorsBonds.items?.values || []),
          ...defaultBondSectors,
        ]),
        international: uniqueArray([
          ...(userSectorsInternational.items?.values || []),
          ...defaultInternationalSectors,
        ]),
        crypto: uniqueArray([
          ...(userSectorsCrypto.items?.values || []),
          ...defaultCryptoSectors,
        ]),
        overview: uniqueArray([
          ...(userSectorsOverview.items?.values || []),
          ...overviewSectors,
        ]),
      },
    };
  } catch (err) {
    return {
      status: 500,
      message: 'There was an error processing the request: ' + err,
    };
  }
};
