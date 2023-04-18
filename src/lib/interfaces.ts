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

export interface IStockItem {
  papel: string;
  nome: string;
  setor_bovespa: string | null;
  subsetor_bovespa: string | null;
  segmento_bovespa: string | null;
  participação_no_ibovespa: string | null;
  crescimento_médio_anual: string | null;
  cotacao: number | null;
  'p/l': number | null;
  'p/vp': number | null;
  psr: number | null;
  dividend_yield: number | null;
  margem_ebit: number | null;
  margem_liquida: number | null;
  patrimonio_liquido: number | null;
  liq_corrente: number | null;
  'div/patrimonio': number | null;
  roe: number | null;
  cresc_5_anos: number | null;
  valor_de_mercado: string | null;
  dividendo_por_acao?: string | null;
  lucro_por_acao?: string | null;
  quantity?: string | null;
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

export interface IStockItemOld {
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
  'Cresc.5anos': number | null;
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

export interface IStockItemResponse {
  status: number;
  message: string;
  items: IStockItem[];
}
