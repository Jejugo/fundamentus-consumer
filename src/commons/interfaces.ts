export interface IGetResponse<T> {
  status: number;
  message: string;
  items?: T;
}

export interface IStockItem {
  papel: string;
  nome: string;
  setor_bovespa: string;
  subsetor_bovespa: string;
  segmento_bovespa: string;
  participação_no_ibovespa: string;
  crescimento_médio_anual: string;
  cotacao: number;
  'p/l': number;
  'p/vp': number;
  psr: number;
  dividend_yield: number;
  margem_ebit: number;
  margem_liquida: number;
  patrimonio_liquido: number;
  liq_corrente: number;
  'div/patrimonio': number;
  roe: number;
  cresc_5_anos: number | null;
  valor_de_mercado: string;
  dividendo_por_acao?: string;
  lucro_por_acao?: string;
  quantity?: string;
}

interface IStockItemOld {
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
  'Líq.2meses': number;
  'Patrimônio Líquido': number;
  'Dívida Bruta/Patrim.': number;
  'Cresc.5anos': number;
  nome: string;
  setor_bovespa: string;
  subsetor_bovespa: string;
  segmento_bovespa: string;
  'seg._listagem': string;
  participação_no_ibovespa: string;
  crescimento_médio_anual: string;
  quantity: string;
  fco: string;
  'capex/fco': string;
  'capex/d&a': string;
  'L/P': string;
  valor_de_mercado: string;
  dividendo_por_acao: string;
  lucro_por_acao: string;
}

interface IStockItemResponse {
  status: number;
  message: string;
  items: IStockItem[] | IStockItemOld[];
}

// INTERNAL STATE
interface IStatement {
  checked: boolean;
  statement: string;
  weight: number;
}

interface IDropdownItem {
  value: string;
  label: string;
}

interface IUser {
  uid: string;
  email: string;
}

interface IAuthUserContext {
  authUser: User | null;
  loading: boolean;
}

export interface IWalletResistancePoints {
  [key: string]: number;
}

// FIRESTORE

interface IFirebaseUserAssetStatements {
  [key: string]: IStatement[];
}

interface IFirebaseUserAssets {
  [key: string]: IStockItemOld;
}

interface IFirebaseStrategyStatements {
  [key: string]: IStatement;
}
interface IFirebaseWatchList {
  shares: string[];
}
