import { getDataById } from '../../../commons/request';

export const walletRecommendationCalls = userId => ({
  getUserReits: () => getDataById('user:reits', 'userReits', userId, true),
  getUserStocks: () => getDataById('user:stocks', 'userStocks', userId, true),
  getUserBonds: () => getDataById('user:bonds', 'userBonds', userId, true),
  getUserInternational: () =>
    getDataById('user:international', 'userInternational', userId, true),
  getUserCrypto: () =>
    getDataById('user:international', 'userCrypto', userId, true),
  getStocksStrategy: () =>
    getDataById('stocks:strategy', 'stocksStrategy', userId, true),
  getReitsStrategy: () =>
    getDataById('reits:strategy', 'reitsStrategy', userId, true),
  getUserGoals: async () => {
    const data = await getDataById('user:goals', 'goals', userId, true);
    return data.items;
  },
});

export const getWalletData = (userId: string) => ({
  stocks: {
    asset: walletRecommendationCalls(userId).getUserStocks,
    assetStrategy: walletRecommendationCalls(userId).getStocksStrategy,
  },
  reits: {
    asset: walletRecommendationCalls(userId).getUserReits,
    assetStrategy: walletRecommendationCalls(userId).getReitsStrategy,
  },
  bonds: {
    asset: walletRecommendationCalls(userId).getUserBonds,
    assetStrategy: null,
  },
  international: {
    asset: walletRecommendationCalls(userId).getUserInternational,
    assetStrategy: null,
  },
  crypto: {
    asset: walletRecommendationCalls(userId).getUserCrypto,
    assetStrategy: null,
  },
});
