import {
  IAssetType,
  IFirestoreGetAllUserAssets,
  ITableRow,
  IWalletResistancePoints,
  RecommendedPercentages,
} from 'commons/interfaces';
import { IReitItem, IStockItem } from 'lib/interfaces';

const assetScore = (
  userAsset: IStockItem & IReitItem,
  type: string,
): number => {
  let points = 0;

  if (type === 'stocks') {
    if (userAsset['p/l'] <= 15) points++;
    if (userAsset['lpa'] > 1.5) points++;
    if (userAsset['p/vp'] <= 1.5 && userAsset['p/vp'] > 0) points++;
    if (userAsset.crescimento5Anos / 100 > 0) points++;

    return points;
  } else {
    if (typeof userAsset.p_vp === 'number') {
      if (userAsset.p_vp <= 1) points = 3;
    } else {
      if (parseFloat(userAsset.p_vp.replace(',', '.')) <= 1) points = 3;
      return (points = 3);
    }
    return points;
  }
};

interface IBuildAssetTableData {
  type: IAssetType;
  assets: IFirestoreGetAllUserAssets;
  item: keyof (IStockItem & IReitItem);
  recommendedPercentages: RecommendedPercentages;
  assetPoints: IWalletResistancePoints;
}

export const buildAssetTableData = ({
  type,
  assets,
  item,
  recommendedPercentages,
  assetPoints,
}: IBuildAssetTableData): ITableRow => {
  return {
    type,
    cheapStockScore: assetScore(assets[item] as any, type),
    symbol: assets[item].papel.toLowerCase(),
    asset: assets[item].nome,
    recommended: recommendedPercentages[item].percentage,
    currentValue: parseInt(assets[item].quantity) * assets[item].cotacao,
    recommendedValue: 0,
    adjustment: '',
    grade: assetPoints[item],
    total: '',
    quantity: parseInt(assets[item].quantity),
  };
};

interface IBuildAssetTableDataNoStrategy {
  type: IAssetType;
  assets: Record<string, { value: number }>;
  item: string;
  recommendedPercentages: RecommendedPercentages;
}

export const buildAssetTableDataNoStrategy = ({
  type,
  assets,
  item,
  recommendedPercentages,
}: IBuildAssetTableDataNoStrategy): ITableRow => {
  return {
    type,
    cheapStockScore: 4,
    symbol: item.toLowerCase(),
    asset: item.toLowerCase(),
    recommended: recommendedPercentages[item].percentage,
    currentValue: assets[item].value,
    recommendedValue: 0,
    adjustment: '',
    grade: 0,
    total: '',
    quantity: 0,
  };
};
