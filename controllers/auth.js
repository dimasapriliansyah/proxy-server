const User = require('../models/user')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


exports.getTestRoute = (req, res, next) => {
  res.send("OK")
}

exports.postSignup = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({
        message: 'Validation Failed',
        errors: validationErrors.array(),
        data: req.body
      })
    }
    const { username, email, name, password } = req.body
    const foundUserUsername = await User.findOne({ username }).exec()
    const foundUserEmail = await User.findOne({ email }).exec()
    if (foundUserUsername || foundUserEmail) {
      return res.status(422).json({
        message: 'User already exists.',
        found: foundUserUsername || foundUserEmail,
        data: { username, email, name, password }
      })
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = new User({
      username, email, name, password: hashedPassword
    })
    const savedUser = await newUser.save()
    return res.status(201).json(savedUser)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message })
  }
}

exports.postLogin = async (req, res, next) => {
  try {
    const username = req.body.username
    const password = req.body.password
    const foundUser = await User.findOne({ username }).exec()
    if (!foundUser) {
      return res.status(422).json({
        message: 'User with declared username do not exists.',
        found: null,
        data: { username, password }
      })
    }
    const comparedPassword = await bcrypt.compare(password, foundUser.password)
    if (!comparedPassword) {
      return res.status(422).json({
        message: 'Invalid Password',
        data: { username, password }
      })
    }
    jwt.sign({ username, email: foundUser.email }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRED_DURATION
    }, (err, token) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ message: error.message })
      }
      return res.status(200).json({ token })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message })
  }

}