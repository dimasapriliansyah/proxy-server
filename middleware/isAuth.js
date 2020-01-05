const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const authHeader = req.get('Authorization')

    if (!authHeader) {
      const error = new Error('Not authenticated.')
      error.statusCode = 401
      throw error
    }
    const token = authHeader.split(' ')[1]

    let decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    if (!decodedToken) {
      const error = new Error('Not authenticated.')
      error.statusCode = 401
      throw error
    }
    req.username = decodedToken.username
    next()
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message
      })
    }
    console.log(error)
    return res.status(500).json({
      message: error.message
    })
  }

};