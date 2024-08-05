const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const cors = require('cors')
const helmet = require('helmet')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, './../.env') })
  require('dotenv').config({ path: path.join(__dirname, './../.env.development') })
  console.log(`starting server in ${process.env.NODE_ENV} environment flag ...`)
}

const enforceHTTPS = require('./middleware/enforceHTTPS')
const { routerLogger, errorLogger } = require('./models/logger')

const app = express()

// middleware ...
app.use(express.json())
app.use(routerLogger)

// TODO: decide if you want a whitelist or just have a global API.
app.use(cors())
app.use(helmet({ contentSecurityPolicy: false }))

if(process.env.NODE_ENV === 'production') {
  app.use(enforceHTTPS)
}
app.use('/', serveStatic(path.join(__dirname, './../dist')))
app.use('/public', serveStatic(path.join(__dirname, './../public')))

// API routes
const home = require('./routes')                  // The root endpoints
const profile = require('./routes/profile')
const resources = require('./routes/resources')

app.use('/', home)
app.use('/profile', profile)
app.use('/resources', resources)

// express-winston errorLogger AFTER the other routes have been defined.
app.use(errorLogger)

module.exports = app
