export interface IGetResponse<T> {
  status: number;
  message: string;
  items?: T;
}
export type IFundamentusStockTypes =
  | 'Papel'
  | 'Cotação'
  | 'P/L'
  | 'P/VP'
  | 'PSR'
  | 'Dividend Yield'
  | 'P/Ativo'
  | 'P/Cap. Giro'
  | 'P/EBIT'
  | 'P/Ativ.Circ. Líq.'
  | 'EV/EBIT'
  | 'EV/EBITDA'
  | 'Mrg Ebit'
  | 'Margem Líquida'
  | 'Líq. Corrente'
  | 'ROIC'
  | 'ROE'
  | 'Líq.2meses '
  | 'Patrimônio Líquido'
  | 'Dívida Bruta/Patrim.'
  | 'Cresc.5anos';

export type IFundamentusReitsTypes =
  | 'Papel'
  | 'Segmento'
  | 'Cotação'
  | 'FFO'
  | 'Yield'
  | 'Dividend'
  | 'Yield'
  | 'P/VP'
  | 'Valor de Mercado'
  | 'Liquidez'
  | 'Qtd. de imóveis'
  | 'Preço m2'
  | 'Aluguel m2'
  | 'Cap.Rate'
  | 'Vacância Média'
  | 'Endereço';

export interface IFundamentusStockItem {
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

export interface IFundamentusReitsItem {
  Papel: string;
  Segmento: string;
  Cotação: number;
  'FFO Yield': number;
  'Dividend Yield': number;
  'P/VP': number;
  'Valor de Mercado': number;
  Liquidez: number;
  'Qtd. Imóveis': number;
  'Preço m2': number;
  'Aluguel m2': number;
  'Cap. Rate': number;
  'Vacância Média': number;
  Endereço: string;
}

export interface IBondItem {
  [key: string]: number;
}

export interface IInternationalItem {
  [key: string]: number;
}

export interface IReitItem {
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
  p_vp: string;
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

export interface IStockItem {
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

export interface IStockItemResponse {
  status: number;
  message: string;
  items: IFundamentusStockItem[] | IStockItem[];
}

export interface IWalletResistancePoints {
  [key: string]: number;
}
