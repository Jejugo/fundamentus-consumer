
const filter = require('../filters/shares')
const integration = require('../integration/integration')
const redis = require('../../server/redis')
const redisController = require('../lib/redisController')
const redisClient = redis.client

const folder = 'shares'

/**
 * @module lib/shares
 * @method [lib/shares] checkSharesOnCacheAndFundamentus()
 * @description Check if there is data on Redis then Fundamentus
 * @returns {String[]}
 */
const checkSharesOnCacheAndFundamentus = async () => {
  let [ redisData, fundamentusData ] = await Promise.all([ 
    redisController.getAllKeysFromFolder({ folder }),  
    integration.getDataFromFundamentus()
  ])
  
  if(redisData){
    const shareValues = await Promise.all(redisData.map(key => redisController.getKeyValue(folder, key.replace(`${folder}:`, ''))))
    console.info('getting data from Redis and filtering good data...')
    return shareValues
  }

  console.info('getting data from fundamentus website and filtering good data...')
  return filter.basedOnValidation(fundamentusData)
}

/**
 * @module lib/shares
 * @method [lib/shares] getGoodShares()
 * @description Get shares and filter the good ones
 * @returns {{status, message, items}}
 */
const getGoodShares = async () => {
  try {
    const shares = await checkSharesOnCacheAndFundamentus()
    return {
      status: 200,
      message: 'Data retrieved from Redis.',
      items: filter.basedOnValidation(shares)
    }
  }
  catch(err){
    throw new Error('Cannot retrieve data from api or Redis.', err)
  }
}

/**
 * @module lib/shares
 * @method [lib/shares] getAllShares()
 * @description Get all shares
 * @returns {{status, message, items}}
 */
const getAllShares = async () => {
  try {

    const shares = await checkSharesOnCacheAndFundamentus()
    return {
      status: 200,
      message: 'Data retrieved from Redis.',
      items: shares
    }
    
  }
  catch(err){
    throw new Error('Cannot retrieve data from api or Redis.', err)
  }
}

const fundamentusSync = async () => {
  try {
    let shares = await integration.getDataFromFundamentus()
    shares.forEach(async share => 
      await redisClient.setAsync(`shares:${share["Papel"]}`, JSON.stringify(share)))

    return {
      status: 200,
      message: 'Shares successfully saved'
    }
  }
  catch(err){
    console.log('Erro: ', err)
  }
}

module.exports = {
  getGoodShares,
  getAllShares,
  fundamentusSync
}