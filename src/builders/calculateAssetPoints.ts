import { IStatement, IWalletResistancePoints } from 'commons/interfaces';

interface IAssetStrategy {
  [key: string]: IStatement[];
}
/**
 * Calculates the resistance points of an asset strategy.
 * Run through a list of assets and their statements and calculates the resistance points  of each asset.
 * If checked is true, the weight is added to the resistance points, if checked is false, the weight is subtracted from the resistance points.
 * @param {IAssetStrategy} assetsToInvest - Object containing the asset strategy to be analyzed.
 * @returns {Promise<IWalletResistancePoints>} - A promise that resolves to an object containing the resistance points of each asset.
 * @throws {string} - Throws an error if no asset points are found.
 */
export default (
  assetsToInvest: IAssetStrategy,
): Promise<IWalletResistancePoints> =>
  new Promise((resolve, reject) => {
    const assetPoints = Object.keys(assetsToInvest).reduce(
      (acc: IWalletResistancePoints, assetKey: string) => ({
        ...acc,
        [assetKey]: assetsToInvest[assetKey].reduce(
          (acc: number, statement: IStatement): number => {
            if (statement.checked) return acc + 1 * parseInt(statement.weight);
            else if (!statement.checked)
              return acc + -1 * parseInt(statement.weight);

            return acc + 0;
          },
          0,
        ),
      }),
      {},
    );
    if (!Object.keys(assetPoints).length) reject('No asset points found.');
    resolve(assetPoints);
  });
