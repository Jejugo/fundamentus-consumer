import { IStockItem } from 'lib/interfaces';
import assesCompany from '../validations/stock_assessment';

export const basedOnValidation = (data: IStockItem[]) =>
  data.filter((item: IStockItem) => assesCompany(item));
