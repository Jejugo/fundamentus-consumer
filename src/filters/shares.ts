import assesCompany from '../validations/assessment';

export const basedOnValidation = (data: any) =>
  data.filter((item: any) => assesCompany(item));
