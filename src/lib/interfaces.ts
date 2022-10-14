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

export interface IStockItem {
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

export interface IGetResponse<T> {
  status: number;
  message: string;
  items?: T;
}
