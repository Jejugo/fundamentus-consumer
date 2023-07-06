import { bondSectors } from './bonds';
import { IReitItem } from './interfaces';
import { internationalSectors } from './international';
import { getReits } from './reits';
import { getShares } from './shares';

export const getAllSectors = async () => {
  const reits = await getReits();
  const stocks = await getShares();

  const reitSectors = [
    ...new Set(reits.items.map((reit: IReitItem) => reit['segmento'])),
  ].filter(a => a);

  const stockSectors = [
    ...new Set(stocks.items.map((stock: IReitItem) => stock['subsetor'])),
  ].filter(a => a);

  return {
    status: 200,
    message: 'Data Retrieved',
    items: {
      stocks: stockSectors,
      reits: reitSectors,
      bonds: bondSectors,
      international: internationalSectors,
    },
  };
};
