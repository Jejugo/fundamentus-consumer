import axios from 'axios';
import cheerio from 'cheerio';
import {
  IFundamentusStockItem,
  IFundamentusStockTypes,
} from '../../lib/interfaces';

import fundamentusConfig from './';

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
    const response = await axios.get(`${fundamentusConfig.host}/resultado.php`);
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
        `There was an error accessing the website: ${fundamentusConfig.host}: ${err.message}`,
      );
    return undefined;
  }
};
