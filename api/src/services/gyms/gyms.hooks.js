const { authenticate } = require('@feathersjs/authentication').hooks
const assignCreatedBy = require('../../hooks/created-by')
const { restrictAccessForGym } = require('../../hooks/authorization')

const logger = require('../../logger')

// function rawFalse(context) {
//   if (!context.params.sequelize) context.params.sequelize = {}
//   Object.assign(context.params.sequelize, { raw: false })
// }

async function createUserGym(context) {
  // https://github.com/feathersjs-ecosystem/feathers-sequelize/issues/230
  // await context.result.addUser(parseInt(context.params.user.id, 10))

  const userGymRoleModel = context.app.services['user-gym-role'].Model

  userGymRoleModel.create({userId: parseInt(context.params.user.id, 10), gymId: context.result.id, role: 'OWNER'})
    .then((userGymRole) => {
      logger.info('Create user gym %o', userGymRole.get({
        plain: true
      }))
    })
}

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [restrictAccessForGym({gymIdField: 'id'})],
    get: [restrictAccessForGym({gymIdField: 'id'})],
    create: [assignCreatedBy],
    update: [restrictAccessForGym({gymIdField: 'id', role: ['OWNER', 'ADMIN']})],
    patch: [restrictAccessForGym({gymIdField: 'id', role: ['OWNER', 'ADMIN']})],
    remove: [restrictAccessForGym({gymIdField: 'id', role: ['OWNER']})]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [createUserGym],
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
