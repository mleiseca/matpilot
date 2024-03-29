const Email = require('email-templates')
const logger = require('../../logger')

module.exports = function(app) {

  function getLink(type, hash) {
    const url = app.get('frontendUrlBase') + type + '?token=' + hash
    return url
  }

  function sendEmail(email) {
    return app.service('mailer').create(email).then(function (result) {
      logger.info('Sent email %o', result)
    }).catch(err => {
      logger.warn('Error sending email %o', err)
    })
  }

  return {
    notifier: async function(type, user, notifierOptions) { /* eslint-disable-line */
      let tokenLink
      let email
      const e = new Email()
      let emailHtml = ''
      switch (type) {
      case 'resendVerifySignup': //sending the user the verification email
        await e.render('verifyEmail/html', {
          tokenLink: getLink('verify', user.verifyToken),
          email: user.email
        }).then((html) => {emailHtml = html})

        email = {
          from: app.get('fromEmail'),
          to: user.email,
          subject: 'Verify your email',
          html: emailHtml
        }
        // .then(console.log)
        // .catch(console.error);

        // tokenLink = getLink('verify', user.verifyToken)
        // email = {
        //   from: app.get('fromEmail'),
        //   to: user.email,
        //   subject: 'Verify Signup',
        //   html: tokenLink
        // }
        break

      case 'verifySignup': // confirming verification
        tokenLink = getLink('verify', user.verifyToken)
        email = {
          from: app.get('fromEmail'),
          to: user.email,
          subject: 'Confirm Signup',
          html: 'Thanks for verifying your email'
        }
        break

      case 'sendResetPwd':
        tokenLink = getLink('reset', user.resetToken)
        email = {
          from: app.get('fromEmail'),
          to: user.email,
          subject: 'Reset your password',
          html: tokenLink
        }
        break

      case 'resetPwd':
        tokenLink = getLink('reset', user.resetToken)
        email = {
          from: app.get('fromEmail'),
          to: user.email,
          subject: 'Password reset',
          html: 'Your password has been reset'
        }
        break

      case 'passwordChange':
        email = {
          from: app.get('fromEmail'),
          to: user.email,
          subject: 'Password updated',
          html: 'Your password has been updated'
        }
        break

      case 'identityChange':
        tokenLink = getLink('verifyChanges', user.verifyToken)
        email = {
          from: app.get('fromEmail'),
          to: user.email,
          subject: 'Verify changes',
          html: tokenLink
        }
        break

      default:
        break
      }

      if (email) {
        sendEmail(email)
      } else {
        logger.warn('No email sent for type: %s' , type)
      }
    }
  }
}
