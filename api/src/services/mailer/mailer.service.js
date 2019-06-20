// Initializes the `/mailer` service on path `/mailer`
const hooks = require('./mailer.hooks');
const Mailer = require('feathers-mailer');
const smtpTransport = require('nodemailer-smtp-transport');

module.exports = function (app) {
  console.log("SMTP details: ", app.get("smtpUser"), app.get("smtpPassword"))
  app.use('/mailer', Mailer(smtpTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    secure: true,
    auth: {
      user: app.get("smtpUser"), //process.env.SMTP_USER,
      pass: app.get("smtpPassword") //process.env.SMTP_PASS
    }
  })));

  const service = app.service('mailer');
  service.hooks(hooks);
};
