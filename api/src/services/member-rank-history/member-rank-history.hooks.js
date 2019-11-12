const { authenticate } = require('@feathersjs/authentication').hooks
const restrictAccessForGym = require('../../hooks/authorization').restrictAccessForGym
// const logger = require('../../logger')

const assignCreatedBy = require('../../hooks/created-by')

async function updateUserRank(context) {
  // https://github.com/feathersjs-ecosystem/feathers-sequelize/issues/230
  // await context.result.addUser(parseInt(context.params.user.id, 10))

  // logger.info('adding rank... %o', context.result)
  const memberModel = context.app.services['members'].Model

  const member = await memberModel.find({
    where: {
      id: context.result.memberId
    }
  })

  // logger.info('member is %o', member)
  if (!member.rank || !member.rankAwardDate || new Date(member.rankAwardDate).getTime() < new Date().getTime()) {
    member.rank = context.result.newRank
    member.rankAwardDate = context.result.awardDate

    // logger.info('SAVING MEMBER %o', member)
    member.save()
  }
  //
  // userGymRoleModel.create({userId: parseInt(context.params.user.id, 10), gymId: context.result.id, role: 'OWNER'})
  //   .then((userGymRole) => {
  //     logger.info('Create user gym %o', userGymRole.get({
  //       plain: true
  //     }))
  //   })
}
module.exports = {
  before: {
    all: [ authenticate('jwt'), restrictAccessForGym()],
    find: [],
    get: [],
    create: [assignCreatedBy],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [updateUserRank],
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
