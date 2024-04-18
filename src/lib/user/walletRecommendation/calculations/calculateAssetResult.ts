import { IAssetType } from '../../../../commons/interfaces';
import { RecommendedPercentages } from '../../../../commons/interfaces';
import { calculatePercentage } from '../../../../commons/utils';

export const buildAssetResult = ({
  assetType,
  totalInvested,
  result,
  recommendedPercentages,
}: {
  recommendedPercentages: Record<IAssetType, RecommendedPercentages>;
  totalInvested: number;
  assetType: string;
  result: any;
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
