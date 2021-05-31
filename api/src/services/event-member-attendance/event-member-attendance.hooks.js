const { authenticate } = require('@feathersjs/authentication').hooks
const assignCreatedBy = require('../../hooks/created-by')
const customQuery = require('../../hooks/custom-query').customQuery
const { restrictAccessForGymWorkers, restrictAccessForMember} = require('../../hooks/authorization')

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

module.exports = {
  before: {
    all: [ authenticate('jwt'),  ],
    find: [restrictAccessForMember(), customQuery({queries: queries})],
    get: [restrictAccessForMember()],
    create: [restrictAccessForGymWorkers(), assignCreatedBy],
    update: [restrictAccessForGymWorkers()],
    patch: [restrictAccessForGymWorkers()],
    remove: [restrictAccessForGymWorkers()]
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
