//TODO: THINK IF THIS FILE IS EVEN NECESSARY ANYMORE !!!!
/* eslint-disable @typescript-eslint/no-explicit-any */

import csvtojsonV2 from 'csvtojson/v2';

import { ICSVFormattedHeader, ICSVHeader, ICSVStockData } from '../interfaces';
import logger from '../../../server/logger';

const SHEET_PATH =
  '/Users/jeffgoes/Documents/SoftwareDevelopment/Projects/fundamentus-consumer/public';

export const getDataFromCSV = async (
  assetType: string,
): Promise<ICSVStockData[]> => {
  try {
    const sharesFundaments = await csvtojsonV2().fromFile(
      assetType === 'shares'
        ? `${SHEET_PATH}/shares/Planilha_do_Holder_08.04.2023.csv`
        : `${SHEET_PATH}/reits/Planilha_do_Holder_fii_18.10.2022.csv`,
    );

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
    if (err instanceof Error) logger.error(`Error: ${err.message}`);
    logger.error(`Error: ${err}`);

    return [];
  }
};
