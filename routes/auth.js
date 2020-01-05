const express = require('express')
const router = express.Router();
const { body } = require('express-validator')
const { getTestRoute, postSignup, postLogin } = require('../controllers/auth')

router.use(express.json())

router.get('/test', getTestRoute)

router.post('/signup', [
  body('username')
    .trim()
    .not().isEmpty().withMessage('username cannot be empty.')
    .escape()
    .isLength({ max: 50 }),
  body('email')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('name')
    .trim()
    .not().isEmpty().withMessage('name cannot be empty.')
    .escape()
    .isLength({ max: 50 }),
  body('password')
    .trim()
    .not().isEmpty().withMessage('password cannot be empty.')
    .escape()
], postSignup)

router.post('/login', postLogin)

module.exports = router