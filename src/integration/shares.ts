import { IStockItem } from '../lib/interfaces';
import yahooFinance from 'yahoo-finance2';
import symbols from '../../public/b3/symbols.json';
import AWS from 'aws-sdk';
const s3 = new AWS.S3();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const stockInitialValue: IStockItem = {
  papel: '',
  cotacao: 0,
  'p/l': 0,
  'p/vp': 0,
  psr: 0,
  dividend_yield: 0,
  margem_ebit: 0,
  margem_liquida: 0,
  liq_corrente: 0,
  roe: 0,
  patrimonio_liquido: 0,
  'div/patrimonio': 0,
  cresc_5_anos: 0,
  nome: '',
  setor_bovespa: '',
  segmento_bovespa: '',
  subsetor_bovespa: '',
  participação_no_ibovespa: '',
  crescimento_médio_anual: '',
  valor_de_mercado: '',
};

async function getAnnualGrowthRate(ticker: string, years: number) {
  try {
    const currentDate = new Date();
    const startDate = new Date(
      currentDate.getFullYear() - years,
      currentDate.getMonth(),
      currentDate.getDate(),
    );

    const historicalData = await yahooFinance.historical(ticker, {
      period1: startDate,
      period2: currentDate,
      interval: '1d',
    });

    if (historicalData.length > 0) {
      const startPrice = historicalData[0].adjClose;
      const endPrice = historicalData[historicalData.length - 1].adjClose;

      if (startPrice && endPrice) {
        const annualGrowthRate = Math.pow(endPrice / startPrice, 1 / years) - 1;
        console.info(
          `Taxa de crescimento médio anual para ${ticker} em ${years} anos: ${(
            annualGrowthRate * 100
          ).toFixed(2)}%`,
        );

        return `${(annualGrowthRate * 100).toFixed(2)}%`;
      }

      console.error(`Nenhum dado histórico encontrado para ${ticker}`);
      return null;
    }

    return null;
  } catch (error) {
    if (error instanceof Error)
      console.error(
        `Erro ao obter dados históricos para ${ticker}: ${error.message}`,
      );

    throw error;
  }
}

const calculate5YearGrowth = earnings => {
  const revenues = earnings?.financialsChart?.yearly?.map(
    (year: any) => year.revenue,
  );

  if (!revenues) return null;

  const startIndex = Math.max(revenues.length - 5, 0);
  const newRevenues = revenues.slice(startIndex);

  const revenueGrowth: number[] = [];

  for (let i = 1; i < revenues.length; i++) {
    const growth = (newRevenues[i] - newRevenues[i - 1]) / newRevenues[i - 1];
    revenueGrowth.push(growth);
  }

  const anualAverageGrowth =
    revenueGrowth.reduce((a, b) => a + b) / revenueGrowth.length;
  return anualAverageGrowth;
};

const buildFinalStockValue = async (
  stockInitialValue: IStockItem,
  stockQuote: any,
  stockQuoteSummary: any,
  ticker: string,
): Promise<IStockItem | undefined> => {
  return {
    ...stockInitialValue,
    papel: stockQuote.symbol,
    cotacao: stockQuote.regularMarketPrice,
    'p/l': stockQuote.trailingPE || null,
    'p/vp': stockQuote.priceToBook || null,
    dividend_yield: stockQuoteSummary?.summaryDetail?.dividendYield || null,
    margem_ebit: stockQuoteSummary?.financialData?.operatingMargins || null,
    margem_liquida: stockQuoteSummary?.financialData?.profitMargins || null,
    patrimonio_liquido:
      stockQuoteSummary?.defaultKeyStatistics?.bookValue || null,
    psr: stockQuoteSummary?.summaryDetail?.priceToSalesTrailing12Months || null,
    'div/patrimonio': stockQuoteSummary?.financialData?.debtToEquity || null,
    liq_corrente: stockQuoteSummary?.financialData?.currentRatio || null,
    roe: stockQuoteSummary?.financialData?.returnOnEquity || null,
    cresc_5_anos: calculate5YearGrowth(stockQuoteSummary?.earnings) || null,
    valor_de_mercado: stockQuoteSummary?.summaryDetail?.marketCap || null,
    nome: stockQuote?.longName || null,
    setor_bovespa: stockQuoteSummary?.assetProfile?.sector || null,
    subsetor_bovespa: stockQuoteSummary?.assetProfile?.industry || null,
    segmento_bovespa: stockQuoteSummary?.assetProfile?.industry || null,
    participação_no_ibovespa: null, //sheetStock['participação_no_ibovespa'],
    crescimento_médio_anual: null, // await getAnnualGrowthRate(ticker, 5),
  };
};

export const getSharesStats = async (): Promise<any> => {
  const allTickers = symbols;
  const sharesList: (IStockItem | undefined)[] = [];
  let processedItems = 0;

  for (const ticker of allTickers) {
    const formattedTicker = `${ticker}.SA`;
    if (ticker) {
      try {
        const stockQuote = await yahooFinance.quote(formattedTicker);
        const stockQuoteSummary = await yahooFinance.quoteSummary(
          formattedTicker,
          {
            modules: [
              'summaryDetail',
              'financialData',
              'defaultKeyStatistics',
              'earnings',
              'balanceSheetHistory',
              'assetProfile',
            ],
          },
        );

        const finalStockValue = await buildFinalStockValue(
          stockInitialValue,
          stockQuote,
          stockQuoteSummary,
          formattedTicker,
        );
        console.log(
          `Financial data for ${formattedTicker} successfully obtained.`,
        );

        sharesList.push(finalStockValue);
      } catch (err) {
        if (err instanceof Error)
          console.error(
            `Error when looking up for financial data of: ${formattedTicker} - ${err.message}`,
          );
      }
    }

    processedItems += 1;

    await new Promise(resolve => {
      console.info(`Processing ${processedItems} out of ${symbols.length}`);
      console.info('Waiting 1 second to prevent getting rate limited.');
      setTimeout(resolve, 1000);
    });
  }
};

async function getJsonFileFromS3(bucket, key) {
  try {
    console.log(process.env.AWS_ACCESS_KEY_ID);
    console.log(process.env.AWS_SECRET_ACCESS_KEY);
    const params = { Bucket: bucket, Key: key };
    const response = await s3.getObject(params).promise();
    const jsonData = response.Body && JSON.parse(response.Body.toString());
    return jsonData;
  } catch (error) {
    console.error('Error reading JSON file from S3:', error);
    throw error;
  }
}

export const getShares = async () => {
  const bucket = 'sharestock-files';
  const key = 'asset_list.json';

  const result = await getJsonFileFromS3(bucket, key);
  return result;
};
