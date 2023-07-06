export const internationalSectors = [
  'Stocks',
  'Reits',
  'Technology ETF',
  'Gaming ETF',
  'Medical ETF',
  'Dividends ETF',
  'Growth ETF',
  'S&P ETF',
  'Treasury',
];

export const getInternationalSectors = async () => {
  return {
    status: 200,
    message: 'Data Retrieved',
    items: internationalSectors,
  };
};
