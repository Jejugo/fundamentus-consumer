import * as filter from '../filters/shares';
import * as Integration from '../integration/shares';
import { getCompaniesTypesFromB3 } from '../integration/b3/companies';
import { getDataFromCSV } from '../integration/csv/holderCSV';
import * as redisController from './redisController';
import Firestore from '../firebase';

import { IGetResponse, IStockItem } from './interfaces';

import redis from '../../server/redis';
import { ICSVStockData } from 'integration/interfaces';
import { convertArrayToObject } from '../builders/arrays';

const redisClient = redis.client;

const folder = 'shares';

/**
 * @module lib/shares
 * @method [lib/shares] checkSharesOnCacheAndFundamentus()
 * @description Check if there is data on Redis if not go to Fundamentus
 * @returns {String[]}
 */
export const checkCache = async () => {
  const redisData: string[] | null = await redisController.getAllKeysFromFolder(
    {
      folder,
    },
  );

  if (!redisData) return;

  const shareValues: IStockItem[] = await Promise.all(
    redisData.map((key: string) =>
      redisController.getKeyValue(folder, key.replace(`${folder}:`, '')),
    ),
  );

  console.info('getting data from Redis and filtering good data...');
  return undefined;
};

export const getShares = async (
  optimized: boolean,
): Promise<IGetResponse<IStockItem[]>> => {
  try {
    let isCached = false;
    let shares: IStockItem[] | undefined = undefined;

    shares = await checkCache();

    if (shares) isCached = true;

    shares = isCached ? shares : await Integration.getShares();

    return {
      status: 200,
      message: `Data retrieved from ${isCached ? 'Redis' : 'API'}. `,
      items: optimized ? filter.basedOnValidation(shares) : shares,
    };
  } catch (err) {
    throw new Error(`Cannot retrieve data from api or Redis: ${err}`);
  }
};

/**
 * @module lib/shares
 * @method [lib/shares] fundamentusSync()
 * @description Get all shares
 * @returns {{status, message}}
 */
export const sync = async (): Promise<IGetResponse<any>> => {
  try {
    const shares = await Integration.getShares();
    if (shares) {
      shares.forEach(
        async (share: any) =>
          await redisClient.setAsync(
            `shares:${share['Papel']}`,
            JSON.stringify(share),
          ),
      );

      const sharesMap = convertArrayToObject(shares, 'Papel');
      const sharesRef = Firestore.collection('assets').doc(
        'zn1FPK3pJjgQZqKADAmwaXBe9eD2',
      );
      const docGet = await sharesRef.get();
      const currentStocks = docGet.data();
      if (currentStocks) {
        const updatedStocks = Object.keys(currentStocks).reduce(
          (acc, stockSymbol) => ({
            ...acc,
            [stockSymbol]: {
              ...currentStocks[stockSymbol],
              Cotação: sharesMap[stockSymbol]['Cotação'],
            },
          }),
          {},
        );
        await sharesRef.set(updatedStocks);
      }
    }

    return {
      status: 200,
      message: 'Shares successfully saved',
    };
  } catch (err) {
    return {
      status: 500,
      message: 'Not able to get Shares from fundamentus',
    };
  }
};

export const sharesTypesSync = async () => {
  await getCompaniesTypesFromB3();
};

export const getSheetStocks = async (assetType: string) => {
  const allShares = await getDataFromCSV(assetType);
  return allShares;
};

export const mergeStockData = (
  fundamentusStocks: IStockItem[] | undefined,
  sheetStocks: ICSVStockData[],
) => {
  const allAssets: IStockItem[] = [];
  if (fundamentusStocks) {
    for (const asset of fundamentusStocks) {
      for (const sheetStock of sheetStocks) {
        if (
          asset['Papel'].toLowerCase() ===
          sheetStock['código_de_neg.'].toLowerCase()
        ) {
          allAssets.push({
            ...asset,
            nome: sheetStock['nome'],
            setor_bovespa: sheetStock['setor_bovespa'],
            subsetor_bovespa: sheetStock['subsetor_bovespa'],
            segmento_bovespa: sheetStock['segmento_bovespa'],
            participação_no_ibovespa: sheetStock['participação_no_ibovespa'],
            crescimento_médio_anual: sheetStock['crescimento_médio_anual'],
            // fco: sheetStock['fco'],
            // 'capex/fco': sheetStock['capex/fco'],
            // 'capex/d&a': sheetStock['capex/d&a'],
            // 'L/P': (asset['Cotação'] / asset['P/L'] / asset['Cotação']).toFixed(
            //   2,
            // ),
            valor_de_mercado: sheetStock['valor_de_mercado'],
            dividendo_por_acao: (
              asset['Cotação'] * asset['Dividend Yield']
            ).toFixed(2),
            lucro_por_acao: (
              asset['Cotação'] *
              (asset['Cotação'] / asset['P/L'] / asset['Cotação'])
            ).toFixed(2),
            quantity: '',
          });
        }
      }
    }
  }

  return allAssets;
};
