const fundamentusLib = require('../lib/fundamentus/shares');

const fundamentusSync = async ctx => {
  ctx.body = await fundamentusLib.sync();
};
const fundamentusIndicators = async ctx => {
  const { optimized = false } = ctx.query;
  ctx.body = await fundamentusLib.getSharesIndicators(optimized);
};

const fundamentusGetAllShares = async ctx => {
  const { optimized = false } = ctx.query;
  const indicators = await fundamentusLib.getSharesIndicators(optimized);
  const sheetAssets = await fundamentusLib.getSheetAssets();

  const indicatorsItems = indicators.items;

  const allAssets = [];
  for (let asset of indicatorsItems) {
    for (let sheetAsset of sheetAssets) {
      if (
        asset['Papel'].toLowerCase() ===
        sheetAsset['código_de_neg.'].toLowerCase()
      ) {
        allAssets.push({
          ...asset,
          nome: sheetAsset['nome'],
          setor_bovespa: sheetAsset['setor_bovespa'],
          subsetor_bovespa: sheetAsset['subsetor_bovespa'],
          segmento_bovespa: sheetAsset['segmento_bovespa'],
          'seg._listagem': sheetAsset['seg._listagem'],
          participação_no_ibovespa: sheetAsset['participação_no_ibovespa'],
          crescimento_médio_anual: sheetAsset['crescimento_médio_anual'],
          fco: sheetAsset['fco'],
          'capex/fco': sheetAsset['capex/fco'],
          'capex/d&a': sheetAsset['capex/d&a'],
          'L/P': (asset['Cotação'] / asset['P/L'] / asset['Cotação']).toFixed(
            2,
          ),
          valor_de_mercado: sheetAsset['valor_de_mercado'],
          dividendo_por_acao: (
            asset['Cotação'] * asset['Dividend Yield']
          ).toFixed(2),
          lucro_por_acao: (
            asset['Cotação'] *
            (asset['Cotação'] / asset['P/L'] / asset['Cotação'])
          ).toFixed(2),
        });
      }
    }
  }

  ctx.body = {
    status: 200,
    message: 'Data successfully retrieved',
    items: allAssets,
  };
};

module.exports = {
  fundamentusIndicators,
  fundamentusSync,
  fundamentusGetAllShares,
};
