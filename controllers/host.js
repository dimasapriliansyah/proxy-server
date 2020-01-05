const { validationResult } = require('express-validator')

const Host = require('../models/host')
const redis = require('../libs/redisConnector')

exports.getTestRoute = (req, res, next) => {
  res.send("OK")
}

exports.getHosts = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1
    const perPage = 10
    const totalHost = await Host.find().countDocuments().exec()
    const hosts = await Host.find().skip((currentPage - 1) * perPage).limit(perPage).exec()
    return res.status(200).json({ total: totalHost, data: hosts, currentPage, perPage })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message })
  }

}

exports.postAddHost = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({
        message: 'Validation Failed',
        errors: validationErrors.array(),
        data: req.body
      })
    }
    const { tenantId, host } = req.body
    const foundHost = await Host.findOne({ tenantId }).exec()
    if (foundHost) {
      return res.status(422).json({
        message: 'Host with declared tenantId already exists.',
        found: foundHost,
        data: { tenantId, host }
      })
    }
    const newHost = new Host({
      tenantId,
      host
    })
    const savedHost = await newHost.save()
    return res.status(200).json(savedHost)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message })
  }
}

exports.getHost = async (req, res, next) => {
  try {
    const tenantId = req.params.tenantId
    const foundHost = await Host.find({ tenantId })
    return res.status(200).json({ data: foundHost })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message })
  }
}

exports.updateHost = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({
        message: 'Validation Failed',
        errors: validationErrors.array(),
        data: req.body
      })
    }
    const tenantId = req.params.tenantId
    const { host } = req.body
    const foundHost = await Host.findOne({ tenantId }).exec()
    if (!foundHost) {
      return res.status(422).json({
        message: 'Host with declared tenantId do not exists.',
        found: null,
        data: { tenantId, host }
      })
    }
    foundHost.host = host
    await foundHost.save()
    await redis.del(tenantId)
    return res.json({ data: foundHost })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message })
  }
}

exports.deleteHost = async (req, res, next) => {
  try {
    const tenantId = req.params.tenantId
    const deletedHost = await Host.find({ tenantId })
    const deleted = await Host.deleteOne({ tenantId }).exec()
    return res.status(200).json({ deleted, deletedHost })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message })
  }
}