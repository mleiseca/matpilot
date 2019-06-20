// Initializes the `/mailer` service on path `/mailer`
const hooks = require('./mailer.hooks')
const Mailer = require('feathers-mailer')
const smtpTransport = require('nodemailer-smtp-transport')

module.exports = function (app) {
  const smtpUser = process.env.SMTP_USER || app.get('smtpUser')
  const smtpPassword = process.env.SMTP_PASS || app.get('smtpPassword')
  app.use('/mailer', Mailer(smtpTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPassword
    }
  })))

  const service = app.service('mailer')
  service.hooks(hooks)
}
