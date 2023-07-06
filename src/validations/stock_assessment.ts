import { IStockItem } from 'lib/interfaces';

export default (value: IStockItem) => {
  let points = 0;

  if (value.crescimento5Anos > 0) {
    points++;
  }
  if (value['dividaBruta_pl'] < 1.15) {
    points++;
  }
  if (value.liquidezCorrente > 1) {
    points++;
  }
  if (value.margemLiquida > 0.1) {
    points++;
  }
  if (value['p_l'] > 0 && value['p_l'] < 10) {
    points++;
  }
  if (value.roe > 0.1) {
    points++;
  }
  if (value.dividendYield > 0.05) {
    points++;
  }

  return points > 5;
};
