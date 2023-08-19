import { IAssetType } from '../../../commons/interfaces';
import { convertArrayToObject } from '../../../builders/arrays';

import { columnsNames } from '../../../const/investTableColumns';
import { getData, getDataById, setData } from '../../../commons/request';
import { RecommendedPercentages } from '../../../commons/interfaces';
import { calculatePercentage } from '../../../commons/utils';
import { assetTypesToCalculate } from './helpers';
import { walletRecommendationCalls } from './getWalletData';
import { calculateResultByAsset } from './calculations';

export const buildAssetResult = ({
  assetType,
  totalInvested,
  result,
  recommendedPercentages,
}: {
  recommendedPercentages: Record<IAssetType, RecommendedPercentages>;
  totalInvested: number;
  assetType: string;
  goals: any;
  result: any;
  allAssets: any;
}) => {
  const currentPercentage = item => item.currentValue / totalInvested;
  const recommendedPercentage = item =>
    recommendedPercentages[assetType][item.symbol].percentage / 100;
  const percentageByAssetType = result[assetType].percentage;

  const recommendedValue = item =>
    totalInvested * recommendedPercentage(item) * percentageByAssetType;

  return {
    ...result[assetType],
    tableData: result[assetType].tableData.map(item => {
      return {
        ...item,
        total: currentPercentage(item),
        recommendedValue: recommendedValue(item),
        recommended: percentageByAssetType * recommendedPercentage(item),
        isBalanced:
          recommendedValue(item) >= item.currentValue
            ? recommendedValue(item) - item.currentValue <= 1000
            : recommendedValue(item) - item.currentValue >= -1000,
        adjustment: `${calculatePercentage(
          item.currentValue,
          recommendedValue(item),
        ).toFixed(2)}% R$${Math.abs(
          item.currentValue - recommendedValue(item),
        ).toFixed(2)}`,
      };
    }),
  };
};

interface IAssetRecommentation {
  percentage: number;
  tableData: {
    type: string;
    cheapStockScore: number;
    symbol: string;
    asset: string;
    recommended: number;
    currentValue: number;
    recommendedValue: number;
    adjustment: string;
    grade: number;
    total: number;
    quantity: number;
  }[];
}

interface IGetWalletRecommendationResponse {
  status: number;
  message: string;
  items: {
    totalInvested: number;
    reits: IAssetRecommentation;
    stocks: IAssetRecommentation;
  };
}

export const getWalletRecommendation = async (userId: string): Promise<any> => {
  try {
    const goals = await walletRecommendationCalls(userId).getUserGoals();

    const assetTypes = assetTypesToCalculate({
      goals,
      skipAssets: ['overview'],
    });

    const {
      result: resultByAsset,
      recommendedPercentages,
      allAssets,
    } = await calculateResultByAsset({
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

    const resultItems = assetTypes.reduce((acc: any, type: any) => {
      acc[type] = buildAssetResult({
        assetType: type,
        totalInvested,
        goals,
        result: resultByAsset,
        recommendedPercentages,
        allAssets,
      });
      return acc;
    }, {});

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
};
