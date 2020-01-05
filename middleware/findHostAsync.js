const Host = require('../models/host')

const redis = require('../libs/redisConnector')

module.exports = async (req, res, next) => {
  try {
    let proxyHost;
    const key = req.params.tenantId
    const findRouteInRedis = await redis.get(key)
    if (findRouteInRedis) {
      proxyHost = JSON.parse(findRouteInRedis).host
      req.proxyHost = proxyHost
      next()
    } else if (!findRouteInRedis) {
      const findRouteInMongo = await Host.findOne({ tenantId: key }).exec()
      if (!findRouteInMongo) {
        const error = new Error('No host with declared ID')
        error.statusCode = 404
        throw error
      }
      // Replace
      await redis.del(key)
      await redis.set(key, JSON.stringify(findRouteInMongo))
      proxyHost = findRouteInMongo['host']
      req.proxyHost = proxyHost
      next()
    }

  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message })
    }
    console.log(error)
    return res.status(500).json({ message: error.message })
  }
}