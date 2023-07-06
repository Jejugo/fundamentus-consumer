export interface IGetResponse<T> {
  status: number;
  message: string;
  items?: T;
}

export type IAssetType = 'stocks' | 'reits' | 'international' | 'bonds';

interface IFundamentusStockItem {
  Papel: string;
  Cotação: number;
  'P/L': number;
  'P/VP': number;
  PSR: number;
  'Dividend Yield': number;
  'P/Ativo': number;
  'P/Cap. Giro': number;
  'P/EBIT': number;
  'P/Ativ.Circ. Líq.': number;
  'EV/EBIT': number;
  'EV/EBITDA': number;
  'Mrg Ebit': number;
  'Margem Líquida': number;
  'Líq. Corrente': number;
  ROIC: number;
  ROE: number;
  'Líq.2meses ': number;
  'Patrimônio Líquido': number;
  'Dívida Bruta/Patrim.': number;
  'Cresc.5anos': number;
}

interface IStockItem {
  setor: string;
  max52semanas: number;
  roe: number;
  CAGRLucros5Anos: number;
  'p/vp': number;
  'p/ativo': number;
  'p/l': number;
  margemEbit: number;
  liquidezMediaDiaria: number;
  liquidezCorrente: number;
  psr: number;
  dividendYield: number;
  liquidez2Meses: number;
  'ev/ebit': number;
  CAGRReceitas5Anos: number;
  margemBruta: number;
  lucroLiquido: number;
  'dividaBruta/pl': 0;
  subsetor: string;
  cotacao: number;
  'ev/ebitda': number;
  valorDeMercado: number;
  lpa: number;
  papel: string;
  roic: number;
  'p/ebit': number;
  ROA: number;
  'p/capitalDeGiro': number;
  vpa: number;
  margemLiquida: number;
  'p/acl': number;
  nome: string;
  patrimonioLiquido: number;
  'dividaLíquida/patrimônio': number;
  min52semanas: number;
  giroAtivos: number;
  'pl/ativos': number;
  'dividaLiquida/ebit': number;
  'passivo/ativo': number;
  numeroAcoes: number;
  crescimento5Anos: number;
}

interface IReitItem {
  alguelM2: number;
  capRate: number;
  cota_cagr: number;
  cotacao: number;
  dividendYield: number;
  'dividendo/cota': number;
  'ffo/cota': number;
  ffoYield: number;
  gestao: string;
  id: string;
  liquidez: number;
  liquidezMediaDiaria: number;
  nome: string;
  numeroCotas: number;
  numeroCotistas: number;
  'p/vp': number;
  papel: string;
  patrimonioLiquido: number;
  percentualCaixa: number;
  precoM2: number;
  quantidadeDeImoveis: number;
  quantidadeDeUnidades: number;
  segmento: string;
  ultimoDividendo: number;
  vacanciaMedia: number;
  valorDeMercado: number;
  'valorPatrimonial/cota': number;
}

type IUserStockItem = IStockItem & {
  quantity: string;
};

interface IStockItemResponse {
  status: number;
  message: string;
  items: IFundamentusStockItem[] | IStockItem[];
}

// INTERNAL STATE
export interface IStatement {
  checked: boolean;
  statement: string;
  weight: string;
}

interface IDropdownItem {
  value: string;
  label: string;
}

interface IUser {
  uid: string;
  email: string;
}

export interface IWalletResistancePoints {
  [key: string]: number;
}

export interface RecommendedPercentages {
  [key: string]: {
    name: string;
    percentage: number;
    points: number;
  };
}

export interface ITableRow {
  type: string;
  symbol: string;
  asset: string;
  recommended: number;
  currentValue: number;
  recommendedValue: number;
  adjustment: string;
  grade: number;
  total: string;
  quantity: number;
  cheapStockScore: number;
}

export interface ITableColumn {
  id: string;
  label: string;
  minWidth: number;
  align?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined;
  format?: (value: number) => string | number;
}

export interface IFirestoreGetAllUserAssets {
  [key: string]: IUserStockItem | IUserReitItem;
}

// FIRESTORE

interface IFirebaseUserAssetStatements {
  [key: string]: IStatement[];
}

interface IFirebaseUserAssets {
  [key: string]: IStockItem;
}

interface IFirebaseStrategyStatements {
  [key: string]: IStatement;
}
interface IFirebaseWatchList {
  shares: string[];
}
