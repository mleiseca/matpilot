const { authenticate } = require('@feathersjs/authentication').hooks
const assignCreatedBy = require('../../hooks/created-by')
const customQuery = require('../../hooks/custom-query').customQuery
const restrictAccessForGym = require('../../hooks/authorization').restrictAccessForGym

const queries = {
  'SCHEDULE_REPORT':
  'select\n' +
    '    se.id as scheduled_event_id,\n' +
    '    se.title as scheduled_event_title,\n' +
    '    coalesce(event_attendance_summary.number_of_classes, 0) as number_of_classes,\n' +
    '    coalesce(event_attendance_summary.unique_students, 0) as unique_students,\n' +
    '    coalesce(event_attendance_summary.total_students, 0) as total_students\n' +
    'from\n' +
    '    scheduled_events as se\n' +
    'left outer join\n' +
    '(select\n' +
    '    e."scheduledEventId" as scheduled_event_id,\n' +
    '    count(distinct e.id) as number_of_classes,\n' +
    '    count(distinct ema."memberId") as unique_students,\n' +
    '    count(ema."memberId") as total_students\n' +
    'from\n' +
    '    events as e,\n' +
    '    event_member_attendance ema\n' +
    'where\n' +
    '    e.id = ema."eventId"\n' +
    '    and e."gymId" = $gymId\n' +
    '    and $startDateTime <= e."startDateTime"\n' +
    '    and e."startDateTime" <  $endDateTime\n' +
    'group by e."scheduledEventId") event_attendance_summary\n' +
    'on se.id = event_attendance_summary.scheduled_event_id\n' +
    '   where\n' +
    'se."gymId" = $gymId'


}

module.exports = {
  before: {
    all: [ authenticate('jwt'), restrictAccessForGym() ],
    find: [customQuery({queries: queries})],
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
