const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
)

const loader = async function (serverProtocol, port, host, hostname, cert = undefined) {
  try {

    const app = express()

    // ROUTES MODULES
    const hostRoute = require('./routes/host')
    const authRoute = require('./routes/auth')
    const apiRoute = require('./routes/api')

    // GLOBAL MIDDLEWARES
    // Securing response header
    app.use(helmet())
    // CORS-ENABLED
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      next()
    })
    // Logger
    app.use(morgan('combined', { stream: accessLogStream }))

    // ROUTES REGISTER
    app.get('/test', (req, res, next) => {
      res.send("OK")
    })
    app.use('/host', hostRoute)
    app.use('/auth', authRoute)
    app.use('/api', apiRoute)

    // DB
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

    // HTTPS
    if (cert) {
      return console.log('https')
    }
    // HTTP
    const server = serverProtocol.createServer(app)
    return server.listen(port, host, () => {
      console.log(`ON5 Proxy Server : ${hostname}:${port}`)
      console.log(`/                : ${hostname}:${port}/test`)
      console.log(`/host            : ${hostname}:${port}/host/test`)
      console.log(`/auth            : ${hostname}:${port}/auth/test`)
      console.log(`/api             : ${hostname}:${port}/api/test`)
    })

  } catch (error) {
    console.log(error)
  }
}

module.exports = loader;