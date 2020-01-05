const express = require('express')
const router = express.Router();
const proxy = require('express-http-proxy');

const { getTestRoute, proxyRequest } = require('../controllers/api')

const findHostAsync = require('../middleware/findHostAsync')

router.get('/test', getTestRoute)

router.use('/:tenantId', findHostAsync, proxy((req) => {
  return req.proxyHost
}))
module.exports = router