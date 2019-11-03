const { authenticate } = require('@feathersjs/authentication').hooks
const assignCreatedBy = require('../../hooks/created-by')
const restrictAccessForGym = require('../../hooks/authorization').restrictAccessForGym

// TODO: C/Ped from members.hooks.js
function customQuery(hook) {
  const { $customQuery } = hook.params.query

  // console.log('checking custom query')
  // console.log($customQuery)
  if (!$customQuery) {
    // console.log('NO custom query')
    Promise.resolve(hook)
    return
  }
  // delete hook.params.query.$customQuery;

  const queries = {
    'ATTENDANCE_DURING_PERIOD':
    'select event_member_attendance.*, period_events."startDateTime", period_events.title from event_member_attendance,\n' +
    '  (select id, "startDateTime", title From events where $startDateTime <= "startDateTime" and "startDateTime" <= $endDateTime and "gymId" = $gymId) period_events\n' +
    'where\n' +
    '  "memberId" = $memberId and\n' +
    '  "eventId" = period_events.id\n' +
    'order by period_events."startDateTime"',
    'TRAINING_TIME_DURING_PERIOD':
    'select event_member_attendance."memberId", sum(period_events."endDateTime" - period_events."startDateTime") as total_time from event_member_attendance,\n' +
    '  (select id, "startDateTime", "endDateTime", title From events where $startDateTime <= "startDateTime" and "startDateTime" <= $endDateTime and "gymId" = $gymId) period_events\n' +
    'where\n' +
    '  "memberId" = $memberId and\n' +
    '  "eventId" = period_events.id\n' +
    'group by event_member_attendance."memberId"'
  }

  // console.log('running custom query....')
  const sequelize = hook.app.get('sequelizeClient')

  // console.log('bind', $customQuery.bind)
  return sequelize.query(queries[$customQuery.type], {
    model: sequelize.models['event-member-attendance'],
    // bind: { currentEventId: 13, attendedAfter: '2019-08-10' }
    bind: $customQuery.bind
  }).then(results => {
    // console.log('results', results)
    hook.result = results // this tells feathers to skip the DATA STORE step above
    return hook // always resolve the promise chain with the context
  })
}

module.exports = {
  before: {
    all: [ authenticate('jwt'), restrictAccessForGym() ],
    find: [customQuery],
    get: [],
    create: [assignCreatedBy],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    // all: [ fastJoin(attendanceResolvers) ],
    all: [],
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
