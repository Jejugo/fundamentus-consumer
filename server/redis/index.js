const bluebird = require('bluebird')

let client

const createClient = () => {
  const { REDIS_HOST, REDIS_DB, REDIS_SCAN_COUNT, REDIS_EXPIRE } = require('../../configs')
  const redisConfig = {
    REDIS_HOST,
    REDIS_DB,
    REDIS_SCAN_COUNT,
    REDIS_EXPIRE
  }

  const redis = require('redis')


  bluebird.promisifyAll(redis.RedisClient.prototype)
  bluebird.promisifyAll(redis.Multi.prototype)

  console.info('starting Redis...')
  client = redis.createClient(redisConfig)
  client.on('error', () => console.error('error starting redis'))

  return client
}

/*
 * const createTestClient = () => {
 *   const redisMock = require('redis-mock')
 *   bluebird.promisifyAll(redisMock.RedisClient.prototype)
 *   bluebird.promisifyAll(redisMock.Multi.prototype)
 */

/*
 *   client = redisMock.createClient()
 *   return client
 * }
 */

module.exports = {
  get client () {
    return client || createClient()
  }
}