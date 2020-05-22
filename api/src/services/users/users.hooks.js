const { authenticate } = require('@feathersjs/authentication').hooks

const verifyHooks = require('feathers-authentication-management').hooks
const accountService = require('../authmanagement/notifier')
const commonHooks = require('feathers-hooks-common')
const hydrate = require('feathers-sequelize/hooks/hydrate')

function includeRoles() {
  return function (hook) {
    const userGymModel = hook.app.service('user-gym-role').Model
    const association = {
      include: [
        { model: userGymModel, attributes: ['id', 'gymId', 'role'] }
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

const userMemberQuery = 'select "gymId", id, "firstName", "lastName" From members where email = $email';

function includeMemberGyms() {
  return function(hook) {
    const user = hook.result.dataValues

    if (! user.isVerified) {
      return hook;
    }

    const sequelize = hook.app.get('sequelizeClient')

    return sequelize.query(userMemberQuery, {
      // TODO: there should probably be some limit here, right? like don't return 100000 members...
      model: sequelize.models['member'],
      bind: {
        email: user.email
      }
    }).then(results => {
      const members = results[0]
      const membersByGym = []
      const gymIds = []

      for (let member of members) {
        const gymId = member.gymId

        let gym
        if (gymId in membersByGym ) {
          gym = membersByGym[gymId]
        }else {
          gym = { gymId, members: [] }
          gymIds.push(gymId)
        }
        gym.members.push(member)
        membersByGym[gymId] = gym
      }

      // Ok, now we can sort to make a reproducible result
      gymIds.sort()

      const sortedMembersWithGym = []
      for (let gymId of gymIds) {
        sortedMembersWithGym.push(membersByGym[gymId])
      }

      // hook.dispatch is a writeable, optional property and contains a "safe" version of the data that should be sent to any client.
      // If context.dispatch has not been set context.result will be sent to the client instead.
      hook.dispatch.membersByGym = sortedMembersWithGym
      return hook // always resolve the promise chain with the context
    })

  }
}

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt'), includeRoles() ],
    create: [ hashPassword(), commonHooks.lowerCase('email'), verifyHooks.addVerification() ],
    update: [ commonHooks.disallow('external') ],
    patch: [  commonHooks.iff(
      commonHooks.isProvider('external'),
      commonHooks.preventChanges(true,
        ['email',
          'isVerified',
          'verifyToken',
          'verifyShortToken',
          'verifyExpires',
          'verifyChanges',
          'resetToken',
          'resetShortToken',
          'resetExpires']
      ),
      hashPassword(),
      authenticate('jwt')
    ) ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [includeRoles(), includeMemberGyms()],
    create: [
      context => {
        accountService(context.app).notifier('resendVerifySignup', context.result)
      },
      verifyHooks.removeVerification(),
    ],
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
