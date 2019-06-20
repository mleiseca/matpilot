const logger = require('./logger')

module.exports = function(app) {

  function getLink(type, hash) {
    const url = app.get('frontendUrlBase') + type + '?token=' + hash
    return url
  }

  function sendEmail(email) {
    return app.service('mailer').create(email).then(function (result) {
      logger.info('Sent email', result)
    }).catch(err => {
      logger.warn('Error sending email', err)
    })
  }

  return {
    notifier: function(type, user, notifierOptions) { /* eslint-disable-line */
      let tokenLink
      let email
      switch (type) {
      case 'resendVerifySignup': //sending the user the verification email
        tokenLink = getLink('verify', user.verifyToken)
        email = {
          from: app.get('fromEmail'),
          to: user.email,
          subject: 'Verify Signup',
          html: tokenLink
        }
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
        logger.warn('No email sent for type: ' , type)
      }
    }
  }
}
