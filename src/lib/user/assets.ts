import { getDataById, setData } from '../../commons/request';
import defaultSectors from '../../const/defaultSectors.json';

const uniqueArray = array =>
  array.filter(
    (item, index, self) =>
      index === self.findIndex(obj => obj.name === item.name),
  );

export const setAssetTypeSectors = async (uid: string, item, assetType) => {
  const formatAssetType =
    assetType.charAt(0).toUpperCase() + assetType.slice(1);

  try {
    const {
      items: { values },
    } = await getDataById(
      'user:sectors:bond',
      `userSectors${formatAssetType}`,
      uid,
      true,
    );

    const sectors = defaultSectors[assetType];

    const newData = {
      values: uniqueArray([...sectors, ...(values || []), item]),
    };

    await setData(`userSectors${formatAssetType}`, newData, uid);

    return {
      status: 200,
      message: `Data saved successfully`,
      data: newData,
    };
  } catch (err) {
    return {
      status: 500,
      message: 'There was an error processing the request: ' + err,
    };
  }
};

export const deleteUserAssetSector = async (
  uid: string,
  itemId: string,
  assetType: string,
) => {
  const formatAssetType =
    assetType.charAt(0).toUpperCase() + assetType.slice(1);

  try {
    const {
      items: { values },
    } = await getDataById(
      'user:sectors:bond',
      `userSectors${formatAssetType}`,
      uid,
      true,
    );

    const sectors = defaultSectors[assetType];

    const newData = {
      values: uniqueArray(
        [...sectors, ...(values || [])].filter(item => item.id !== itemId),
      ),
    };

    await setData(`userSectors${formatAssetType}`, newData, uid);

    return {
      status: 200,
      message: `Data saved successfully`,
      data: newData,
    };
  } catch (err) {
    return {
      status: 500,
      message: 'There was an error processing the request: ' + err,
    };
  }
};
