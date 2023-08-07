import { Builder, Browser, By } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import logger from '../../../server/logger';

const b3URL = 'https://sistemaswebb3-listados.b3.com.br/indexPage/day/IBOV';

const DOWNLOAD_PATH =
  '/Users/jeffgoes/Documents/SoftwareDevelopment/Projects/fundamentus-consumer/src/tmp';

export const getCompaniesTypesFromB3 = async (): Promise<void> => {
  const screen = {
    width: 640,
    height: 480,
  };

  const chromePrefs = { 'download.default_directory': DOWNLOAD_PATH };
  const chromeOptions = new chrome.Options()
    .setUserPreferences(chromePrefs)
    .headless()
    .windowSize(screen);

  const driver: any = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(chromeOptions)
    .build()
    .catch(err => logger.error(`Error: ${err.message}`));

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
    if (err instanceof Error)
      logger.error(
        `There was an error while executing Selenium Webdriver: ${err.message}`,
      );
  } finally {
    logger.info('Selenium successfully executed!');
    await driver.quit();
  }
};
