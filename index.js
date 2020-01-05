require('dotenv').config()
const http = require('http')
const appLoader = require('./app')

const PORT = parseInt(process.env.APP_PORT) || 3000
const HOST = process.env.APP_HOST
const HOSTNAME = process.env.APP_HOSTNAME

appLoader(http, PORT, HOST, HOSTNAME)