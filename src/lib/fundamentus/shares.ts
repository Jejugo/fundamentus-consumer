import * as filter from '../../filters/shares';
import { getSharesFromFundamentus } from '../../integration/fundamentus/shares';
import { getCompaniesTypesFromB3 } from '../../integration/b3/companies';
import { getDataFromCSV } from '../../integration/csv/holderCSV';
import * as redisController from '../redisController';
import Firestore from '../../firebase';

import { IGetResponse, IFundamentusStockItem, IStockItem } from '../interfaces';

import redis from '../../../server/redis';
import { ICSVStockData } from 'integration/interfaces';
import { convertArrayToObject } from '../../builders/arrays';

const redisClient = redis.client;

const folder = 'shares';

/**
 * @module lib/shares
 * @method [lib/shares] checkSharesOnCacheAndFundamentus()
 * @description Check if there is data on Redis if not go to Fundamentus
 * @returns {String[]}
 */
export const checkSharesOnCacheAndFundamentus = async () => {
  const redisData: string[] | null = await redisController.getAllKeysFromFolder(
    {
      folder,
    },
  );
  if (redisData) {
    const shareValues: IFundamentusStockItem[] = await Promise.all(
      redisData.map((key: string) =>
        redisController.getKeyValue(folder, key.replace(`${folder}:`, '')),
      ),
    );

    console.info('getting data from Redis and filtering good data...');
    return shareValues;
  }

  return getSharesFromFundamentus();
};

export const getFundamentusIndicators = async (
  optimized: boolean,
): Promise<IGetResponse<IFundamentusStockItem[]>> => {
  try {
    const shares = await checkSharesOnCacheAndFundamentus();
    return {
      status: 200,
      message: 'Data retrieved from Redis.',
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
    const shares = await getSharesFromFundamentus();
    if (shares) {
      shares.forEach(
        async (share: any) =>
          await redisClient.setAsync(
            `shares:${share['Papel']}`,
            JSON.stringify(share),
          ),
      );

      const sharesMap = convertArrayToObject(shares, 'Papel');
      const sharesRef = Firestore.collection('userAssets').doc(
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
    console.log('Erro: ', err);
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
  fundamentusStocks: IFundamentusStockItem[] | undefined,
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
            'seg._listagem': sheetStock['seg._listagem'],
            participação_no_ibovespa: sheetStock['participação_no_ibovespa'],
            crescimento_médio_anual: sheetStock['crescimento_médio_anual'],
            fco: sheetStock['fco'],
            'capex/fco': sheetStock['capex/fco'],
            'capex/d&a': sheetStock['capex/d&a'],
            'L/P': (asset['Cotação'] / asset['P/L'] / asset['Cotação']).toFixed(
              2,
            ),
            valor_de_mercado: sheetStock['valor_de_mercado'],
            dividendo_por_acao: (
              asset['Cotação'] * asset['Dividend Yield']
            ).toFixed(2),
            lucro_por_acao: (
              asset['Cotação'] *
              (asset['Cotação'] / asset['P/L'] / asset['Cotação'])
            ).toFixed(2),
            'Líq.2meses': 0,
            quantity: '',
          });
        }
      }
    }
  }

  return allAssets;
};
