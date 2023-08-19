import { IAssetType } from '../../../commons/interfaces';

type Goal = Record<
  IAssetType,
  {
    id: number;
    name: IAssetType;
    value: number;
  }
>;

interface AssetTypesToCalculate {
  goals: Goal;
  skipAssets: IAssetType[];
}

export const assetTypesToCalculate = ({
  goals,
  skipAssets,
}: AssetTypesToCalculate) => {
  return Object.keys(goals)
    .map((asset: any) => asset)
    .filter(asset => !skipAssets.includes(asset));
};
