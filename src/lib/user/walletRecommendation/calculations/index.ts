import { IAssetType, ITableRow } from '../../../../commons/interfaces';

import { IWalletResistancePoints } from '../../../interfaces';
import { RecommendedPercentages } from '../../../../commons/interfaces';
import calculateAssetPoints from './calculateAssetPoints';
import calculateAssetPercentages from './calculateAssetPercentages';
import {
  buildAssetTableData,
  buildAssetTableDataNoStrategy,
} from '../../../../builders/investTableData';
import {
  convertArrayToObject,
  convertObjectKeysToList,
} from '../../../../builders/arrays';

import { getWalletData } from '../getWalletData';
import { assetNameMap } from '../const';

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

const getUserStrategies = (assets: any, assetStrategy: any) =>
  Object.keys(assets).reduce((acc: any, curr: string) => {
    if (curr in assetStrategy) {
      acc[curr] = assetStrategy[curr];
    }

    return acc;
  }, {});

const getUserAssetStrategies = async (
  assetType: IAssetType,
  userId: string,
) => {
  const isAssetSupported = assetType in getWalletData(userId);
  const isStrategyAsset = getWalletData(userId)[assetType].assetStrategy;

  if (!isAssetSupported) {
    return {
      assetItems: [],
      userAssetStrategies: {},
    };
  }

  if (!isStrategyAsset) {
    const assets = await getWalletData(userId)[assetType].asset();

    const { items: assetItems } = assets;
    return {
      assetItems,
      userAssetStrategies: {},
    };
  }

  // asset is supported and have strategy
  else {
    const { asset: getAssets, assetStrategy: getAssetStrategy } =
      getWalletData(userId)[assetType];

    const [assets, assetStrategy] = await Promise.all([
      getAssets(),
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

export const calculateResultByAsset = async ({
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

    const hasStrategy = !!Object.keys(userAssetStrategies).length;

    if (hasStrategy) {
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

      const percentageBasedOnGoals =
        goals.overview.find(
          item => item.name.toLowerCase() === assetNameMap[assetType],
        ).value / 100;

      result = {
        ...result,
        [assetType]: {
          percentage: percentageBasedOnGoals,
          tableData,
        },
      };
    }

    // in there's no goal set for that asset
    else if (
      !goals.overview.find(
        item => item.name.toLowerCase() === assetNameMap[assetType],
      )
    ) {
      result = {
        ...result,
        [assetType]: {
          percentage: 0,
          tableData: [],
        },
      };
    }

    // in case asset has no strategies set
    else {
      const percentageBasedOnGoals =
        goals.overview.find(
          item => item.name.toLowerCase() === assetNameMap[assetType],
        )?.value / 100;

      result = {
        ...result,
        [assetType]: {
          percentage: percentageBasedOnGoals,
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
