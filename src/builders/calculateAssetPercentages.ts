import { IWalletResistancePoints } from 'commons/interfaces';

interface IAssetPoints {
  name: string;
  points: number;
}

interface IAssetPercentages {
  [key: string]: number;
}

export interface AssetPercentage {
  name: string;
  percentage: number;
  points: number;
}

const NEGATIVE_DEFAULT = 0.01;

const setNegativeDefault = (
  negativeAssets: IAssetPoints[],
): IAssetPercentages | undefined => {
  if (negativeAssets.length) {
    return negativeAssets.reduce(
      (acc, asset) => ({
        ...acc,
        [asset.name]: NEGATIVE_DEFAULT,
      }),
      {},
    );
  }
  return;
};

const getPositiveAssets = (resistancePoints: IWalletResistancePoints) =>
  Object.entries(resistancePoints)
    .map(([key]) => {
      if (resistancePoints[key] >= 0) {
        return { name: key, points: resistancePoints[key] };
      }
      return null;
    })
    .filter(a => a) as IAssetPoints[];

const getNegativeAssets = (resistancePoints: IWalletResistancePoints) =>
  Object.entries(resistancePoints)
    .map(([key]) => {
      if (resistancePoints[key] < 0) {
        return {
          name: key,
          points: resistancePoints[key],
        };
      }
      return null;
    })
    .filter(a => a) as IAssetPoints[];

/**  Calculates the percentage of points that need to be cut from negative assets in order to balance them with positive assets.
 * @param {IAssetPercentages | undefined} negativeRealPercentages - Object containing the percentages of negative assets.
 * @param {IAssetPoints[]} positiveAssets - Array containing the points of positive assets.
 * @returns {number} - The total cut points to balance negative assets with positive assets.
 */
const calculateNegativeCutPercentage = (
  negativeRealPercentages: IAssetPercentages | undefined,
): number => {
  if (negativeRealPercentages) {
    const negativesCount = Object.keys(negativeRealPercentages).length;

    const negativePercentageSum = NEGATIVE_DEFAULT * negativesCount;
    return negativePercentageSum;
  }
  return 0;
};

const calculatePositivePercentages = (
  positiveAssets: IAssetPoints[],
  negativePercentageSum: number,
): IAssetPercentages => {
  return positiveAssets.reduce(
    (acc, asset) => ({
      ...acc,
      [asset.name]:
        (asset.points * (1 - negativePercentageSum)) /
        positiveAssets.reduce((acc, asset) => acc + asset.points, 0),
    }),
    {},
  );
};

export default (
  resistancePoints: IWalletResistancePoints,
): AssetPercentage[] => {
  // get all Positive assets
  const positiveAssets = getPositiveAssets(resistancePoints);

  // get all Negative assets
  const negativeAssets = getNegativeAssets(resistancePoints);

  // Set all negative assets to 1%
  const negativeRealPercentages = setNegativeDefault(negativeAssets);

  const negativePercentageSum = calculateNegativeCutPercentage(
    negativeRealPercentages,
  );

  const positiveAssetPercentages = calculatePositivePercentages(
    positiveAssets,
    negativePercentageSum,
  );

  const allPercentages = {
    ...positiveAssetPercentages,
    ...negativeRealPercentages,
  };

  const percentagesArray = Object.entries(allPercentages)
    .map(([key, value]: [string, number]) => ({
      name: key,
      percentage:
        value >= 0 && value < 0.01
          ? parseFloat((0.01 * 100).toFixed(2))
          : parseFloat((value * 100).toFixed(2)),
      points: resistancePoints[key],
    }))
    .sort((a, b) => {
      const textA = a.name.toUpperCase();
      const textB = b.name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

  return percentagesArray;
};
