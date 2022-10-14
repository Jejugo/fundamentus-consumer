export interface ICSVHeader {
  [key: string]: string;
}

export type ICSVFormattedHeader = string[];

export interface ICSVStockData {
  '2015': string;
  '2016': string;
  '2017': string;
  '2018': string;
  '2019': string;
  nome: string;
  classe: string;
  'código_de_neg.': string;
  valor_de_mercado: string;
  participação_no_ibovespa: string;
  participação_no_ibrx_100: string;
  classificação: string;
  'seg._listagem': string;
  setor_bovespa: string;
  subsetor_bovespa: string;
  segmento_bovespa: string;
  'p/l': string;
  'l/p': string;
  'ev/ebitda': string;
  'p/vpa': string;
  psr: string;
  cotação: string;
  dividendo_por_ação: string;
  lucro_por_ação: string;
  dividend_yield: string;
  payout: string;
  patrimônio: string;
  dívida_bruta: string;
  caixa_e_equivalentes: string;
  caixa_líquido: string;
  'div_bruta/pl': string;
  'div._líquida/ebitda': string;
  análise: string;
  '2020e_(últimos_12_meses)': string;
  crescimento_médio_anual: string;
  fco: string;
  'capex/fco': string;
  'capex/d&a': string;
  roe: string;
  roic: string;
  roa: string;
  beta: string;
  data_do_balanço_mais_recente: string;
  volume_negociado: string;
  quantidade_de_negócios: string;
}
