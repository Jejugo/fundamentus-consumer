import axios from 'axios';
import cheerio from 'cheerio';
import { Builder, Browser, By } from 'selenium-webdriver';
import csvtojsonV2 from 'csvtojson/v2';
import chrome from 'selenium-webdriver/chrome';
import {
  IFundamentusStockItem,
  IFundamentusStockTypes,
} from '../lib/interfaces';
import { ICSVFormattedHeader, ICSVHeader, ICSVStockData } from './interfaces';

const DOWNLOAD_PATH =
  '/Users/jeffgoes/Documents/SoftwareDevelopment/Projects/fundamentus-consumer/src/tmp';

const SHEET_PATH =
  '/Users/jeffgoes/Documents/SoftwareDevelopment/Projects/fundamentus-consumer/public';

const fundamentusUrl = 'http://www.fundamentus.com.br/resultado.php';
const b3URL = 'https://sistemaswebb3-listados.b3.com.br/indexPage/day/IBOV';

const buildFinalRow = (
  finalRow: IFundamentusStockItem,
  row: any,
): IFundamentusStockItem => {
  Object.keys(finalRow).forEach(
    // @ts-ignore
    (key: IFundamentusStockTypes, index: number) => {
      let rowValue = row[index];
      if (key === 'Papel') {
        finalRow[key] = rowValue;
      } else {
        rowValue = parseFloat(rowValue.replace(/\./g, '').replace(',', '.'));
        if (row[index].includes('%')) {
          //tirar porcentagem, dividir por 100 e transofrmar em numero decimal
          rowValue = row[index].split('%')[0].replace(/,/, '.');

          rowValue = parseFloat((rowValue / 100).toFixed(4));
        }
        finalRow[key] = rowValue;
      }
    },
  );

  return finalRow;
};

const getRow = ($: cheerio.Root, child: cheerio.Element) => {
  const row = $(child)
    .text()
    .split(`\n`)
    .map((item: string) => item.replace(/\s/g, ''));

  row.pop();
  row.shift();

  return row;
};

export const getSharesFromFundamentus = async (): Promise<
  IFundamentusStockItem[] | undefined
> => {
  try {
    const rows: IFundamentusStockItem[] = [];
    const response = await axios.get(fundamentusUrl);
    const $ = cheerio.load(response.data);
    $(`table tbody tr`).each((index: number, element: cheerio.Element) => {
      $(element).each((index: number, child: cheerio.Element) => {
        let finalRow: IFundamentusStockItem = {
          Papel: '',
          Cotação: 0,
          'P/L': 0,
          'P/VP': 0,
          PSR: 0,
          'Dividend Yield': 0,
          'P/Ativo': 0,
          'P/Cap. Giro': 0,
          'P/EBIT': 0,
          'P/Ativ.Circ. Líq.': 0,
          'EV/EBIT': 0,
          'EV/EBITDA': 0,
          'Mrg Ebit': 0,
          'Margem Líquida': 0,
          'Líq. Corrente': 0,
          ROIC: 0,
          ROE: 0,
          'Líq.2meses ': 0,
          'Patrimônio Líquido': 0,
          'Dívida Bruta/Patrim.': 0,
          'Cresc.5anos': 0,
        };

        const row = getRow($, child);
        finalRow = buildFinalRow(finalRow, row);
        rows.push(finalRow);
      });
    });
    return rows;
  } catch (err) {
    if (err instanceof Error)
      throw new Error(
        `There was an error accessing the website: ${fundamentusUrl}: ${err.message}`,
      );
    return undefined;
  }
};

export const getCompaniesTypesFromB3 = async (): Promise<void> => {
  const screen = {
    width: 640,
    height: 480,
  };

  const chromePrefs = { 'download.default_directory': DOWNLOAD_PATH };
  const chromeOptions = new chrome.Options()
    .setUserPreferences(chromePrefs)
    .headless()
    .windowSize(screen);

  const driver: any = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(chromeOptions)
    .build()
    .catch(err => console.error('Error: ', err));

  try {
    await driver.get(b3URL);
    await driver.findElement(By.id('segment')).click();
    await driver
      .findElement(By.xpath("//select[@id='segment']/option[@value='2']"))
      .click();
    await driver
      .findElement(
        By.xpath(
          "//div[contains(@class, 'list-avatar')]//div[contains(@class, 'content')]/p[contains(@class, 'primary-text')]/a",
        ),
      )
      .click();
  } catch (err) {
    console.error(
      'There was an error while executing Selenium Webdriver: ',
      err,
    );
  } finally {
    console.info('Selenium successfully executed!');
    await driver.quit();
  }
};

export const getAllCompaniesFromB3 = async (): Promise<ICSVStockData[]> => {
  try {
    const sharesFundaments = await csvtojsonV2().fromFile(
      `${SHEET_PATH}/Planilha_do_Holder_31.08.2022.csv`,
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
    console.error('Error: ', err);
    return [];
  }
};
