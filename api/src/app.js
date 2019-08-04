const path = require('path')
const favicon = require('serve-favicon')
const compress = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const logger = require('./logger')
const history = require('connect-history-api-fallback')

const feathers = require('@feathersjs/feathers')
const configuration = require('@feathersjs/configuration')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')


const middleware = require('./middleware')
const services = require('./services')
const appHooks = require('./app.hooks')
const channels = require('./channels')

const sequelize = require('./sequelize')

const authentication = require('./authentication')

const app = express(feathers())

// Load app configuration
app.configure(configuration())
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet())
app.use(cors())
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(favicon(path.join(app.get('public'), 'favicon.ico')))
// Host the public folder - and route any SPA urls to index.html (that's history)
// Basically, any request without a dot (.) will return index.html
// The assumption is that your static assets (blahblah.js) are going to have a dot in them.
app.use(history({
  // logger: console.log.bind(console)
}))

app.use('/', express.static(app.get('public'), {
  setHeaders: setCustomCacheControl
}))

// Set up Plugins and providers
app.configure(express.rest())
app.configure(socketio())

app.configure(sequelize)

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware)
app.configure(authentication)
// Set up our services (see `services/index.js`)
app.configure(services)
// Set up event channels (see channels.js)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(express.notFound())
app.use(express.errorHandler({ logger }))

app.hooks(appHooks)

function setCustomCacheControl (res, path) {
  // logger.info("checking path: %s", path)
  if (!path.endsWith('index.html')) {
    // Custom Cache-Control for HTML files
    // 31557600000 - 1 year
    res.setHeader('Cache-Control', 'public, max-age=31557600000, immutable')
  }
}
module.exports = app
