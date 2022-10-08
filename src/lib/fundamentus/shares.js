const filter = require('../../filters/shares');
const integration = require('../../integration/integration');
const redis = require('../../../server/redis');
const redisController = require('../redisController');

const redisClient = redis.client;

const folder = 'shares';

/**
 * @module lib/shares
 * @method [lib/shares] checkSharesOnCacheAndFundamentus()
 * @description Check if there is data on Redis if not go to Fundamentus
 * @returns {String[]}
 */
const checkSharesOnCacheAndFundamentus = async () => {
  let redisData = await redisController.getAllKeysFromFolder({ folder });

  if (redisData) {
    const shareValues = await Promise.all(
      redisData.map(key =>
        redisController.getKeyValue(folder, key.replace(`${folder}:`, '')),
      ),
    );

    console.info('getting data from Redis and filtering good data...');
    return shareValues;
  }

  return integration.getDataFromFundamentus();
};

/**
 * @module lib/shares
 * @method [lib/shares] getAllShares()
 * @description Get all shares
 * @returns {{status, message, items}}
 */
const getSharesIndicators = async optimized => {
  try {
    const shares = await checkSharesOnCacheAndFundamentus();
    return {
      status: 200,
      message: 'Data retrieved from Redis.',
      items: optimized ? filter.basedOnValidation(shares) : shares,
    };
  } catch (err) {
    throw new Error('Cannot retrieve data from api or Redis.', err);
  }
};

/**
 * @module lib/shares
 * @method [lib/shares] fundamentusSync()
 * @description Get all shares
 * @returns {{status, message}}
 */
const sync = async () => {
  try {
    let shares = await integration.getSharesFromFundamentus();
    shares.forEach(
      async share =>
        await redisClient.setAsync(
          `shares:${share['Papel']}`,
          JSON.stringify(share),
        ),
    );

    return {
      status: 200,
      message: 'Shares successfully saved',
    };
  } catch (err) {
    console.log('Erro: ', err);
  }
};

const sharesTypesSync = async () => {
  await integration.getCompaniesTypesFromB3();
};

const getSheetAssets = async () => {
  const allShares = await integration.getAllCompaniesFromB3();
  return allShares;
};

module.exports = {
  getSharesIndicators,
  sync,
  sharesTypesSync,
  getSheetAssets,
};
