import csvtojsonV2 from 'csvtojson/v2';

import { ICSVFormattedHeader, ICSVHeader, ICSVStockData } from '../interfaces';

const SHEET_PATH =
  '/Users/jeffgoes/Documents/SoftwareDevelopment/Projects/fundamentus-consumer/public';

export const getDataFromCSV = async (
  assetType: string,
): Promise<ICSVStockData[]> => {
  try {
    const sharesFundaments = await csvtojsonV2().fromFile(
      assetType === 'shares'
        ? `${SHEET_PATH}/shares/Planilha_do_Holder_18.10.2022.csv`
        : `${SHEET_PATH}/reits/Planilha_do_Holder_fii_18.10.2022.csv`,
    );

    console.log(sharesFundaments);
    const header: ICSVHeader = sharesFundaments.shift();

    const formattedHeader: ICSVFormattedHeader = Object.keys(header).reduce(
      (acc: any, curr: any) => [...acc, header[curr]],
      [],
    );

    return sharesFundaments.map(share => {
      const values = Object.values(share);
      return formattedHeader.reduce(
        (acc, key, index) => ({
          ...acc,
          [key.replace(/\s/g, '_').toLowerCase()]: values[index],
        }),
        {},
      ) as ICSVStockData;
    });
  } catch (err) {
    console.error('Error: ', err);
    return [];
  }
};
