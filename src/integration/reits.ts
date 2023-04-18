import axios from 'axios';
import cheerio from 'cheerio';
import {
  IFundamentusReitsItem,
  IStockItem,
  IFundamentusReitsTypes,
} from '../lib/interfaces';

import fundamentusConfig from './';

const buildFinalRow = (
  finalRow: IFundamentusReitsItem,
  row: any,
): IFundamentusReitsItem => {
  console.log('FINAL ROW: ', finalRow);
  Object.keys(finalRow).forEach(
    // @ts-ignore
    (key: IFundamentusReitsTypes, index: number) => {
      let rowValue = row[index];
      console.log(rowValue);
      if (key === 'Segmento') {
        finalRow[key] = key;
      } else if (typeof rowValue === 'string') {
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

export const getReitsFromFundamentus = async (): Promise<
  IFundamentusReitsItem[] | undefined
> => {
  try {
    const rows: IFundamentusReitsItem[] = [];
    const response = await axios.get(
      `${fundamentusConfig.host}/fii_resultado.php`,
    );
    const $ = cheerio.load(response.data);
    $(`table tbody tr`).each((index: number, element: cheerio.Element) => {
      $(element).each((index: number, child: cheerio.Element) => {
        let finalRow: IFundamentusReitsItem = {
          Papel: '',
          Segmento: '',
          Cotação: 0,
          'FFO Yield': 0,
          'Dividend Yield': 0,
          'P/VP': 0,
          'Valor de Mercado': 0,
          Liquidez: 0,
          'Qtd. Imóveis': 0,
          'Preço m2': 0,
          'Aluguel m2': 0,
          'Cap. Rate': 0,
          'Vacância Média': 0,
          Endereço: '',
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
