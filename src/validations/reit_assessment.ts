import { IReitItem } from 'lib/interfaces';

export default (value: IReitItem) => {
  let points = 0;

  if (value.quantidadeDeImoveis > 3) {
    points++;
  }
  if (value['p/vp'] <= 1) {
    points++;
  }
  if (value.dividendYield > 0.1) {
    points++;
  }

  return points > 2;
};
