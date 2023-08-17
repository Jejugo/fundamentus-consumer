import { IAssetType, ITableRow } from '../../commons/interfaces';
import {
  convertArrayToObject,
  convertObjectKeysToList,
} from '../../builders/arrays';
import { IWalletResistancePoints } from '../interfaces';
import calculateAssetPoints from '../../builders/calculateAssetPoints';
import calculateAssetPercentages from '../../builders/calculateAssetPercentages';
import {
  buildAssetTableData,
  buildAssetTableDataNoStrategy,
} from '../../builders/investTableData';
import { columnsNames } from '../../const/investTableColumns';
import { getData, getDataById, setData } from '../../commons/request';
import { RecommendedPercentages } from '../../commons/interfaces';
import { calculatePercentage } from '../../commons/utils';

const walletRecommendationCalls = userId => ({
  getUserReits: () => getDataById('user:reits', 'userReits', userId, true),
  getUserStocks: () => getDataById('user:stocks', 'userStocks', userId, true),
  getUserBonds: () => getDataById('user:bonds', 'userBonds', userId, true),
  getUserInternational: () =>
    getDataById('user:international', 'userInternational', userId, true),
  getUserCrypto: () =>
    getDataById('user:international', 'userCrypto', userId, true),
  getStocksStrategy: () =>
    getDataById('stocks:strategy', 'stocksStrategy', userId, true),
  getReitsStrategy: () =>
    getDataById('reits:strategy', 'reitsStrategy', userId, true),
  getUserGoals: async () => {
    const data = await getDataById('user:goals', 'goals', userId, true);
    return data.items;
  },
});

const assetNameMap = {
  reits: 'fundos imobiliários',
  stocks: 'ações',
  bonds: 'renda fixa',
  international: 'internacional',
  crypto: 'crypto',
};

const getUserStrategies = (assets: any, assetStrategy: any) =>
  Object.keys(assets).reduce((acc: any, curr: string) => {
    if (curr in assetStrategy) {
      acc[curr] = assetStrategy[curr];
    }

    return acc;
  }, {});

const getWalletData = (userId: string) => ({
  stocks: {
    asset: walletRecommendationCalls(userId).getUserStocks,
    assetStrategy: walletRecommendationCalls(userId).getStocksStrategy,
  },
  reits: {
    asset: walletRecommendationCalls(userId).getUserReits,
    assetStrategy: walletRecommendationCalls(userId).getReitsStrategy,
  },
  bonds: {
    asset: walletRecommendationCalls(userId).getUserBonds,
    assetStrategy: null,
  },
  international: {
    asset: walletRecommendationCalls(userId).getUserInternational,
    assetStrategy: null,
  },
  crypto: {
    asset: walletRecommendationCalls(userId).getUserInternational,
    assetStrategy: null,
  },
});

const buildAssetResult = ({
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

const getUserAssetStrategies = async (
  assetType: IAssetType,
  userId: string,
) => {
  if (!(assetType in getWalletData(userId))) {
    return {
      assetItems: [],
      userAssetStrategies: {},
    };
  }

  if (!getWalletData(userId)[assetType].assetStrategy) {
    const assets = await getWalletData(userId)[assetType].asset();

    const { items: assetItems } = assets;
    return {
      assetItems,
      userAssetStrategies: {},
    };
  } else {
    const { asset: getAsset, assetStrategy: getAssetStrategy } =
      getWalletData(userId)[assetType];

    const [assets, assetStrategy] = await Promise.all([
      getAsset(),
      getAssetStrategy && getAssetStrategy(),
    ]);

    const { items: assetItems } = assets;
    const { items: assetStrategyItems } = assetStrategy as {
      fromRedis: boolean;
      items: any;
    };

    let userAssetStrategies = getUserStrategies(assets, assetStrategyItems);
    userAssetStrategies = convertObjectKeysToList<any>(assetStrategyItems);

    return {
      userAssetStrategies,
      assetItems,
    };
  }
};

interface ICalculateResultByAsset {
  assetTypes: IAssetType[];
  goals: any;
  userId: string;
}

interface ICalculateResultByAssetReturn {
  result: any;
  recommendedPercentages: any;
  allAssets: any;
}

const calculateResultByAsset = async ({
  assetTypes,
  goals,
  userId,
}: ICalculateResultByAsset): Promise<ICalculateResultByAssetReturn> => {
  let result = {} as Record<IAssetType, IAssetRecommentation>;
  let recommendedPercentages = {} as Record<IAssetType, RecommendedPercentages>;
  let allAssets = {} as any;

  for (const assetType of assetTypes) {
    const { userAssetStrategies, assetItems } = await getUserAssetStrategies(
      assetType,
      userId,
    );

    // if asset type has strategy
    if (Object.keys(userAssetStrategies).length) {
      const assetPoints: IWalletResistancePoints = await calculateAssetPoints(
        userAssetStrategies,
      );

      const assetRecommendedPercentages =
        calculateAssetPercentages(assetPoints);

      const recommendedPercentagesByAsset = convertArrayToObject<any>(
        assetRecommendedPercentages,
        'name',
      ) as any;

      recommendedPercentages = {
        ...recommendedPercentages,
        [assetType]: recommendedPercentagesByAsset,
      };

      allAssets = {
        ...allAssets,
        [assetType]: assetItems,
      };

      const tableData: ITableRow[] = Object.keys(assetItems)
        .map((item: any) =>
          buildAssetTableData({
            type: assetType as IAssetType,
            assets: assetItems,
            item,
            recommendedPercentages: recommendedPercentagesByAsset,
            assetPoints,
          }),
        )
        .sort((a, b) => (a.asset < b.asset ? -1 : a.asset > b.asset ? 1 : 0)); //alphabetically

      result = {
        ...result,
        [assetType]: {
          percentage:
            goals.overview.find(
              item => item.name.toLowerCase() === assetNameMap[assetType],
            ).value / 100,
          tableData,
        },
      };
    }

    // in case asset has no strategies set
    else {
      const assetTypeOverallPercentage =
        goals.overview.find(
          item => item.name.toLowerCase() === assetNameMap[assetType],
        ).value / 100;

      result = {
        ...result,
        [assetType]: {
          percentage: assetTypeOverallPercentage,
          tableData: Object.keys(assetItems).map((item: string) => {
            const recommendedPercentageByAsset = {
              [item]: {
                name: item,
                percentage:
                  (goals[assetType].find(
                    (item2: any) =>
                      item2?.name.toLowerCase() === item.toLowerCase(),
                  )?.value as number) || 0,
                points: 0,
              },
            };

            recommendedPercentages = {
              ...recommendedPercentages,
              [assetType]: {
                ...recommendedPercentages[assetType],
                ...recommendedPercentageByAsset,
              },
            };

            return buildAssetTableDataNoStrategy({
              type: assetType as IAssetType,
              assets: assetItems,
              item,
              recommendedPercentages: recommendedPercentageByAsset,
            });
          }),
        },
      };
    }
  }

  return {
    result,
    recommendedPercentages,
    allAssets,
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
    const [goals] = await Promise.all([
      walletRecommendationCalls(userId).getUserGoals(),
    ]);

    const assetTypes: Partial<IAssetType>[] = Object.keys(goals)
      .map(asset => asset)
      .filter(
        asset => asset !== 'overview' && asset !== 'crypto',
      ) as Partial<IAssetType>[];

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
