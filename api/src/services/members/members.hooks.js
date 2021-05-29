const { authenticate } = require('@feathersjs/authentication').hooks
const assignCreatedBy = require('../../hooks/created-by')
const { fastJoin, makeCallingParams } = require('feathers-hooks-common')
const customQuery = require('../../hooks/custom-query').customQuery
const restrictAccessForGym = require('../../hooks/authorization').restrictAccessForGym
const logger = require('../../logger')
const commonHooks = require('feathers-hooks-common')

const BatchLoader = require('@feathers-plus/batch-loader')
const { getResultsByKey, getUniqueKeys } = BatchLoader

const errors = require('@feathersjs/errors')


const memberResolvers = {
  before: context => {
    context._loaders = { event_attendance: {} }
    context._loaders.event_attendance.event_id = new BatchLoader(async (keys, context) => {
      const result = await context.app.service('event-member-attendance').find(makeCallingParams(
        context, {
          memberId: { $in: getUniqueKeys(keys) },
          eventId: context.params.populate.id
        }, undefined, { paginate: false }
      ))
      logger.info(result)
      return getResultsByKey(keys, result, attendance => attendance.memberId, '!')
    },
    { context }
    )
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
}


function createLowerName() {
  return function(hook) {
    if (hook.type !== 'before') {
      throw new Error('The \'createLowerName\' hook should only be used as a \'before\' hook.')
    }

    if (!(hook.method === 'update' || hook.method === 'patch' || hook.method === 'create')) {
      throw new errors.MethodNotAllowed(`The 'createLowerName' hook should only be used on the 'update', 'patch' and 'create' service methods...not ${hook.method}`)
    }

    delete hook.data.lowerFirstName
    delete hook.data.lowerNickname
    delete hook.data.lowerLastName


    if (hook.data.firstName) {
      hook.data.lowerFirstName = hook.data.firstName.toLowerCase()
    }
    if (hook.data.nickname) {
      hook.data.lowerNickname = hook.data.nickname.toLowerCase()
    } else {
      hook.data.lowerNickname = null
    }
    if (hook.data.lastName) {
      hook.data.lowerLastName = hook.data.lastName.toLowerCase()
    }
  }
}

const queries = {
  'SUGGESTED_ATTENDEES': 'select members.* from members\n' +
    'where\n' +
    '  id in (\n' +
    '   select ema."memberId" from events e, events sc, event_member_attendance ema where ' +
    '   e."startDateTime" > $attendedAfter and ' +
    '   e."scheduledEventId" = sc."scheduledEventId" AND ' +
    '    e.id <> sc.id AND\n' +
    '   ema."eventId" = e.id and ' +
    '      sc.id = $currentEventId) ' +
    '  order by members."lowerFirstName" , members."lowerLastName" desc',

  'MEMBER_REPORT': 'select\n' +
    '    "firstName",\n' +
    '    "lastName",\n' +
    '    "dateOfBirth",\n' +
    '    tags,\n' +
    '    rank,\n' +
    '    "rankAwardDate",\n' +
    '    coalesce(attendance.training_time_in_hours, 0) as training_time_in_hours,\n' +
    '    coalesce(attendance.attendance_count, 0) as attendance_count\n' +
    'from\n' +
    '    members m\n' +
    'left outer join\n' +
    '    (select\n' +
    '         ema."memberId" as memberId,\n' +
    '         EXTRACT(epoch FROM (sum(e."endDateTime" - e."startDateTime"))/3600)::int as training_time_in_hours,\n' +
    '         count(e.id) as attendance_count\n' +
    '     from event_member_attendance ema, events e\n' +
    '     where\n' +
    '             ema."eventId" = e.id\n' +
    '       and e."gymId" = 4\n' +
    '     group by ema."memberId") as attendance\n' +
    'on attendance.memberId = m.id\n' +
    'where\n' +
    '    m."gymId" = $gymId'
}


// This comes from https://stackoverflow.com/questions/48602085/using-feathers-client-and-sequelize-many-to-many-relation
function include(hook) {
  const { $include } = hook.params.query

  if (!$include) {
    Promise.resolve(hook)
    return
  }
  // Remove from the query so that it doesn't get included
  // in the actual database query
  delete hook.params.query.$include

  hook.params.sequelize = {
    include: []
  }

  if(Array.isArray($include)) {
    $include.forEach(inc => {
      hook.params.sequelize.include.push({
        // https://sequelize.readthedocs.io/en/latest/api/model/#findalloptions-promisearrayinstance
        model: hook.app.services[inc.model].Model,
        where: inc.where,
        required: true
      })
    })
  }
  return Promise.resolve(hook)
}

module.exports = {
  before: {
    all: [ authenticate('jwt'), restrictAccessForGym()],
    find: [customQuery({queries: queries, model: 'members'}), include],
    get: [],
    create: [
      commonHooks.lowerCase('email'),
      assignCreatedBy,
      createLowerName()

    ],
    update: [
      commonHooks.discard('rank', 'rankAwardDate'),
      commonHooks.lowerCase('email'),
      createLowerName()],
    patch: [
      // commonHooks.iff(
      //   commonHooks.isProvider('external'),
      //   commonHooks.preventChanges(true,
      //     ['waiverSignedDate'])),
      commonHooks.discard('rank', 'rankAwardDate'),
      commonHooks.lowerCase('email'),
      createLowerName()
    ],
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
}
