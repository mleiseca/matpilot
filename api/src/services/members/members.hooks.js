const { authenticate } = require('@feathersjs/authentication').hooks;
const assignCreatedBy = require('../../hooks/created-by')
const { fastJoin, makeCallingParams } = require('feathers-hooks-common');
const restrictAccessForGym = require('../../hooks/authorization').restrictAccessForGym;

const BatchLoader = require('@feathers-plus/batch-loader');
const { getResultsByKey, getUniqueKeys } = BatchLoader;


const { paramsFromClient } = require('feathers-hooks-common');



const memberResolvers = {
  before: context => {
    context._loaders = { event_attendance: {} };
    context._loaders.event_attendance.event_id = new BatchLoader(async (keys, context) => {
        const result = await context.app.service('event-member-attendance').find(makeCallingParams(
          context, {
            memberId: { $in: getUniqueKeys(keys) },
            eventId: context.params.populate.id
          }, undefined, { paginate: false }
        ));
        console.log(result)
        return getResultsByKey(keys, result, attendance => attendance.memberId, '!');
      },
      { context }
    );
  },
  joins: {
    attendance: () => async (member, context) => {
      // context.params.populate: { entity: 'event-member-attendance', id: '31' } }
      if (context.params.populate && context.params.populate.entity === 'event-member-attendance') {
        member.attendance = await context._loaders.event_attendance.event_id.load(member.id)
      }
    }

    // Just in case this is helpful...
    // attendance: (...args) => async (member, context) => {
    //   if (context.params.populate && context.params.populate.entity === 'event-member-attendance') {
    //     member.attendance = (await context.app.service('event-member-attendance').find({
    //       query: {
    //         memberId: member.id,
    //         eventId: context.params.populate.id
    //       }
    //     }))
    //   }
    // },
  }
};

module.exports = {
  before: {
    all: [ authenticate('jwt'), restrictAccessForGym()],
    find: [paramsFromClient('populate')],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ fastJoin(memberResolvers) ],
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
};
