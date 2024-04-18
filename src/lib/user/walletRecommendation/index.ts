import { convertArrayToObject } from '../../../builders/arrays';

import { columnsNames } from '../../../const/investTableColumns';
import { getData, getDataById, setData } from '../../../commons/request';

import { assetTypesToCalculate } from './helpers';
import { walletRecommendationCalls } from './getWalletData';
import { calculateResultByAsset } from './calculations';
import {
  WalletRecommendationResponse,
  WalletRecommendationData,
  WalletRecommendationErrorResponse,
} from './types';
import { buildAssetResult } from './calculations/calculateAssetResult';

export const getWalletRecommendation = async (
  userId: string,
): Promise<
  WalletRecommendationResponse | WalletRecommendationErrorResponse
> => {
  try {
    const goals = await walletRecommendationCalls(userId).getUserGoals();

    const assetTypes = assetTypesToCalculate({
      goals,
      skipAssets: ['overview'],
    });

    const { result: resultByAsset, recommendedPercentages } =
      await calculateResultByAsset({
        assetTypes,
        goals,
        userId,
      });

    const totalInvested = Object.keys(resultByAsset).reduce((acc, curr) => {
      return (
        acc +
        resultByAsset[curr].tableData.reduce((acc, curr) => {
          return acc + curr.currentValue;
        }, 0)
      );
    }, 0);

    const resultItems = assetTypes.reduce(
      (acc: WalletRecommendationData, type: string) => {
        acc[type] = buildAssetResult({
          assetType: type,
          totalInvested,
          result: resultByAsset,
          recommendedPercentages,
        });
        return acc;
      },
      {} as WalletRecommendationData,
    );

    return {
      status: 200,
      message: `Data retrieved successfully`,
      items: {
        totalInvested,
        columnsNames,
        ...resultItems,
      },
    };
  } catch (err) {
    console.error(err);

    return {
      status: 500,
      message: `There was an error when processing wallet balancing: ${err}`,
    };
  }
};

export const userRecommendationUpdate = async (userId: string) => {
  try {
    const { items: userStocks } = await getDataById(
      'user:stocks',
      'userStocks',
      userId,
      true,
    );

    const { items: stocks } = await getData('stocks', 'stocks', true);

    const { items: userReits } = await getDataById(
      'user:reits',
      'userReits',
      userId,
      true,
    );
    const { items: reits } = await getData('reits', 'reits', true);

    const userStocksItem = userStocks;
    const allStocks = convertArrayToObject(stocks, 'papel');

    const usertReitsItem = userReits;
    const allReits = convertArrayToObject(reits, 'papel');

    const commonStockKeys = Object.keys(allStocks).filter(item => {
      return item in userStocksItem;
    });

    const commonReitKeys = Object.keys(allReits).filter(item => {
      return item in usertReitsItem;
    });

    const finalStockValue = commonStockKeys.reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: {
          ...allStocks[curr],
          quantity: userStocksItem[curr].quantity,
        },
      }),
      {},
    );

    const finalReitValue = commonReitKeys.reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: {
          ...allReits[curr],
          quantity: usertReitsItem[curr].quantity,
        },
      }),
      {},
    );

    await Promise.all([
      await setData('userStocks', finalStockValue, userId),
      await setData('userReits', finalReitValue, userId),
    ]);

    return {
      status: 200,
      message: `Data updated successfully`,
    };
  } catch (err) {
    if (err instanceof Error)
      return {
        status: 500,
        message: err.message,
      };

    return {
      status: 500,
      message: err,
    };
  }
};
