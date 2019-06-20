// Initializes the `/mailer` service on path `/mailer`
const hooks = require('./mailer.hooks');
const Mailer = require('feathers-mailer');
const smtpTransport = require('nodemailer-smtp-transport');

module.exports = function (app) {
  app.use('/mailer', Mailer(smtpTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    secure: true,
    auth: {
      user: process.env.SMTP_USER || app.get("smtpUser"),
      pass: process.env.SMTP_PASS || app.get("smtpPassword")
    }
  })));

  const service = app.service('mailer');
  service.hooks(hooks);
};
