const { authenticate } = require('@feathersjs/authentication').hooks
const hydrate = require('feathers-sequelize/hooks/hydrate')
const { restrictAccessForGym, restrictAccessForGymWorkers } = require('../../hooks/authorization')

const commonHooks = require('feathers-hooks-common')
const logger = require('../../logger')

function includeGymAndUser() {
  return function (hook) {
    const gymModel = hook.app.service('gyms').Model
    const userModel = hook.app.service('users').Model
    const association = {
      include: [
        { model: gymModel, attributes: ['id', 'name', 'description'] },
        { model: userModel, attributes: ['id', 'email', 'name'] }
      ]
    }

    switch (hook.type) {
    case 'before':
      hook.params.sequelize = Object.assign(association, { raw: false })
      return Promise.resolve(hook)

    case 'after':
      hydrate( association ).call(this, hook)
      break
    }
  }
}

function replaceUserWithUserId() {
  return async function(hook) {
    logger.info('Incoming: %o', hook.data)
    let users = await hook.app.service('users').find({
      query: {
        email: hook.data.user.email.toLowerCase()
      }
    })

    logger.info('Found user: %o', users)
    if (users.total === 0) {
      // Generate a random password. User will get a reset email to set their own password.
      hook.data.user.password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      let newUser = await hook.app.service('users').create(hook.data.user)
      logger.info('New User! %o', newUser)
      hook.data.userId = newUser.id
    } else {
      hook.data.userId = users.data[0].id
    }
    delete hook.data.user
    logger.info('Done: %o', hook.data)
  }
}

module.exports = {
  before: {
    all: [ authenticate('jwt'), includeGymAndUser() ],
    find: [restrictAccessForGymWorkers()],
    get: [restrictAccessForGymWorkers()],
    create: [restrictAccessForGym({ role: ['OWNER', 'ADMIN'] }),
      commonHooks.iff(commonHooks.isProvider('external'), replaceUserWithUserId())],
    update: [restrictAccessForGym({ role: ['OWNER', 'ADMIN'] }),
      commonHooks.iff(commonHooks.isProvider('external'), commonHooks.discard('gymId', 'userId'))],
    patch: [restrictAccessForGym({ role: ['OWNER', 'ADMIN'] }),
      commonHooks.iff(commonHooks.isProvider('external'), commonHooks.discard('gymId', 'userId'))],
    remove: [restrictAccessForGym({ role: ['OWNER', 'ADMIN'] })]
  },

  after: {
    all: [includeGymAndUser()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
