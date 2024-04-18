export type WalletRecommendationData = {
  stocks: AssetRecommendation;
  reits: AssetRecommendation;
  crypto: AssetRecommendation;
  bonds: AssetRecommendation;
  international: AssetRecommendation;
};

export type WalletRecommendationResponse = {
  status: number;
  message: string;
  items: {
    totalInvested: number;
    columnsNames: {
      id: string;
      label: string;
      minWidth: number;
    }[];
  } & WalletRecommendationData;
};

export type WalletRecommendationErrorResponse = {
  status: number;
  message: string;
};

export type AssetRecommendation = {
  percentage: number;
  tableData: TableData[];
};

export type TableData = {
  type: string;
  cheapStockScore: number;
  symbol: string;
  asset: string;
  recommended: number;
  currentValue: number;
  recommendedValue: number;
  adjustment: string;
  grade: number;
  total: number;
  quantity: number;
  isBalanced: boolean;
};
