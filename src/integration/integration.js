const axios = require('axios');
const cheerio = require('cheerio');
const { Builder, Browser, By } = require('selenium-webdriver');
const csvtojsonV2 = require('csvtojson/v2');
const chrome = require('selenium-webdriver/chrome');

const DOWNLOAD_PATH =
  '/Users/jeffgoes/Documents/SoftwareDevelopment/Projects/fundamentus-consumer/src/tmp';

const SHEET_PATH =
  '/Users/jeffgoes/Documents/SoftwareDevelopment/Projects/fundamentus-consumer/public';

const fundamentusUrl = 'http://www.fundamentus.com.br/resultado.php';
const b3URL = 'https://sistemaswebb3-listados.b3.com.br/indexPage/day/IBOV';

const getSharesFromFundamentus = async () => {
  try {
    let rows = [];
    const response = await axios.get(fundamentusUrl);
    const $ = cheerio.load(response.data);
    $(`table tbody tr`).each((index, element) => {
      $(element).each((index, child) => {
        const finalRow = {
          Papel: '',
          Cotação: '',
          'P/L': '',
          'P/VP': '',
          PSR: '',
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
          ROIC: '',
          ROE: '',
          'Líq.2meses ': '',
          'Patrimônio Líquido': '',
          'Dívida Bruta/Patrim.': '',
          'Cresc.5anos': '',
        };

        let row = $(child)
          .text()
          .split(`\n`)
          .map(item => item.replace(/\s/g, ''));
        row.pop();
        row.shift();

        Object.keys(finalRow).forEach((key, index) => {
          let rowValue = row[index];
          if (key === 'Papel') {
            finalRow[key] = rowValue;
          } else {
            rowValue = parseFloat(
              rowValue.replace(/\./g, '').replace(',', '.'),
            );
            if (row[index].includes('%')) {
              //tirar porcentagem, dividir por 100 e transofrmar em numero decimal

              rowValue = row[index].split('%')[0].replace(/,/, '.');

              rowValue = parseFloat((rowValue / 100).toFixed(4));
            }
            finalRow[key] = rowValue;
          }
        });

        rows.push(finalRow);
      });
    });

    console.log('rows: ', rows[0]);
    return rows;
  } catch (err) {
    throw new Error(
      'There was an error accessing the website: ',
      fundamentusUrl,
    );
  }
};

const getCompaniesTypesFromB3 = async () => {
  const screen = {
    width: 640,
    height: 480,
  };

  const chromePrefs = { 'download.default_directory': DOWNLOAD_PATH };
  const chromeOptions = new chrome.Options()
    .setUserPreferences(chromePrefs)
    .headless()
    .windowSize(screen);

  let driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(chromeOptions)
    .build()
    .catch(err => console.error('Error: ', err));

  try {
    await driver.get(b3URL);
    await driver.findElement(By.id('segment')).click();
    await driver
      .findElement(By.xpath("//select[@id='segment']/option[@value='2']"))
      .click();
    await driver
      .findElement(
        By.xpath(
          "//div[contains(@class, 'list-avatar')]//div[contains(@class, 'content')]/p[contains(@class, 'primary-text')]/a",
        ),
      )
      .click();
  } catch (err) {
    console.error(
      'There was an error while executing Selenium Webdriver: ',
      err,
    );
  } finally {
    console.info('Selenium successfully executed!');
    await driver.quit();
  }
};

const getAllCompaniesFromB3 = async () => {
  try {
    const sharesFundaments = await csvtojsonV2().fromFile(
      `${SHEET_PATH}/Planilha_do_Holder_31.08.2022.csv`,
    );
    const header = sharesFundaments.shift();
    const formattedHeader = Object.keys(header).reduce(
      (acc, curr) => [...acc, header[curr]],
      [],
    );
    return sharesFundaments.map(share => {
      const values = Object.values(share);
      return formattedHeader.reduce(
        (acc, key, index) => ({
          ...acc,
          [key.replace(/\s/g, '_').toLowerCase()]: values[index],
        }),
        {},
      );
    });
  } catch (err) {
    console.error('Error: ', err);
  }
};

module.exports = {
  getSharesFromFundamentus,
  getCompaniesTypesFromB3,
  getAllCompaniesFromB3,
};
