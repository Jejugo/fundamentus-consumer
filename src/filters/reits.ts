import { IReitItem } from 'lib/interfaces';
import assesReit from '../validations/reit_assessment';

export const basedOnValidation = (data: IReitItem[]) =>
  data.filter((item: IReitItem) => assesReit(item));
