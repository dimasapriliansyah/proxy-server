const express = require('express')
const { body } = require('express-validator')
const router = express.Router();

const { getTestRoute, postAddHost, getHost, updateHost, deleteHost, getHosts } = require('../controllers/host')

const isAuth = require('../middleware/isAuth')

router.use(express.json())

router.get('/test', getTestRoute)

router.get('/', isAuth, getHosts)

// Create new host
router.post('/', isAuth, [
  body('tenantId')
    .trim()
    .not().isEmpty().withMessage('tenantId cannot be empty.')
    .escape()
    .isLength({ max: 50 }),
  body('host')
    .trim()
    .not().isEmpty().withMessage('host cannot be empty.')
    .isURL().withMessage('Invalid host value, host must be in url-form')
    .isLength({ max: 100 })
], postAddHost)

// Get single host instance
router.get('/:tenantId', isAuth, getHost)

// Update single host instance
router.put('/:tenantId', isAuth, [
  body('host')
    .trim()
    .not().isEmpty().withMessage('host cannot be empty.')
    .isURL().withMessage('Invalid host value, host must be in url-form')
    .isLength({ max: 100 })
], updateHost)

// Delete single host instance
router.delete('/:tenantId', isAuth, deleteHost)

module.exports = router