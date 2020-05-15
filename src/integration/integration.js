const rp = require('request-promise');
const cheerio= require('cheerio');

const fundamentusUrl = 'http://www.fundamentus.com.br/resultado.php'

const getDataFromFundamentus = async () => {
  try {
    let rows = []
    const response = await rp(fundamentusUrl)
    const $ = cheerio.load(response)

    $(`table tbody tr`).each((index, element) => {
      $(element).each((index, child) => {
        const finalRow = {
          'Papel': '',
          'Cotação': '',
          'P/L': '',
          'P/VP': '',
          'PSR': '',
          'Dividend Yield': '',
          'P/Ativo': '',
          'P/Cap. Giro': '',
          'P/EBIT': '',
          'P/Ativ.Circ. Líq.': '',
          'EV/EBIT': '',
          'EV/EBITDA': '',
          'Mrg Ebit': '',
          'Margem Líquida': '',
          'Líq. Corrente': '',
          'ROIC': '',
          'ROE': '',
          'Líq.2meses ': '', 
          'Patrimônio Líquido': '',
          'Dívida Bruta/Patrim.': '',
          'Cresc.5anos': ''
        } 
        
        let row = $(child).text()
          .split(`\n`)
          .map(item => 
            item.replace(/\s/g, ''))
        row.pop()
        row.shift()

        Object.keys(finalRow).forEach((key, index) => {
          let rowValue = row[index]
          if(key === 'Papel'){
            finalRow[key] = rowValue
          }
          else{
            rowValue = parseFloat(rowValue
              .replace(/\./g, '')
              .replace(',', '.'))
            if(row[index].includes('%')){
              //tirar porcentagem, dividir por 100 e transofrmar em numero decimal

              rowValue = row[index]
                .split('%')[0]
                .replace(/,/, '.')
                
              rowValue = parseFloat((rowValue / 100).toFixed(4))
            }
            finalRow[key] = rowValue
          }
        })
        
        rows.push(finalRow)
      })
    })

    return rows
  }
  catch(err){
    throw new Error('There was an error accessing the website: ', fundamentusUrl)
  }
}

module.exports = {
  getDataFromFundamentus
}