import { IStockItem } from 'lib/interfaces';

export default (value: IStockItem) => {
  let points = 0;

  if (value['Cresc.5anos'] > 0) {
    points++;
  }
  if (value['Dívida Bruta/Patrim.'] < 1.15) {
    points++;
  }
  if (value['Líq. Corrente'] > 1) {
    points++;
  }
  if (value['Margem Líquida'] > 0.1) {
    points++;
  }
  if (value['P/L'] > 0) {
    points++;
  }
  if (value['ROE'] > 0.1) {
    points++;
  }
  if (value['Dividend Yield'] > 0.05) {
    points++;
  }

  return points > 5;
};
