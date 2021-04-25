const { authenticate } = require('@feathersjs/authentication').hooks
const assignCreatedBy = require('../../hooks/created-by')
const customQuery = require('../../hooks/custom-query').customQuery
const restrictAccessForGym = require('../../hooks/authorization').restrictAccessForGym

const queries = {
  'REGISTRATION_DURING_PERIOD':
    'select event_member_registration.*, period_events."startDateTime", period_events.title from event_member_registration,\n' +
    '  (select id, "startDateTime", title From events where :startDateTime <= "startDateTime" and "startDateTime" <= :endDateTime and "gymId" in (:gymIds)) period_events\n' +
    'where\n' +
    '  "memberId" in (:memberIds) and\n' +
    '  "eventId" = period_events.id\n' +
    'order by period_events."startDateTime"'
}

async function updateEventMemberRegistrationCount(context) {

  const eventId = context.result.eventId
  const model = context.app.service('event-member-registration').Model
  const count = await model.count({
    where: {eventId}
  })
  await context.app.service('events').patch(eventId, {registrationCount : count})
  return context
}


async function updateMemberWeeklyRegistrationCount(context) {
  // const query = 'select count(*) as registration_count, date_trunc(\'week\', e."startDateTime" ) as week_start\n' +
  //   'from event_member_registration emr,\n' +
  //   '     events e,\n' +
  //   '     events e_being_registered\n' +
  //   'where emr."eventId" = e.id\n' +
  //   ' and emr."memberId" = $memberId\n' +
  //   ' and e_being_registered.id = $eventId\n' +
  //   ' and date_trunc(\'week\', e."startDateTime" )= date_trunc(\'week\', e_being_registered."startDateTime" )\n' +
  //   ' group by week_start\n'
  const query = 'select date_trunc(\'week\', outer_events."startDateTime" ) as week_start, coalesce(this_week.registration_count, 0) as registration_count from\n' +
    '    events as outer_events\n' +
    'left outer join (\n' +
    'select count(*) as registration_count, date_trunc(\'week\', e."startDateTime" ) as week_start\n' +
    'from event_member_registration emr,\n' +
    '     events e,\n' +
    '     events as e_being_registered\n' +
    'where emr."eventId" = e.id\n' +
    '  and emr."memberId" = $memberId\n' +
    '  and e_being_registered.id = $eventId\n' +
    '  and date_trunc(\'week\', e."startDateTime" )= date_trunc(\'week\', e_being_registered."startDateTime" )\n' +
    'group by week_start) as this_week\n' +
    'on date_trunc(\'week\', outer_events."startDateTime" )= week_start\n' +
    'where outer_events.id = $eventId\n'

  const eventId = context.result.eventId
  const memberId = context.result.memberId
  const gymId = context.result.gymId

  const sequelize = context.app.get('sequelizeClient')

  const queryOptions =  {
    bind: { memberId, eventId}
  }

  return sequelize.query(query, queryOptions).then(async function(results) {
    // context.result = results // this tells feathers to skip the DATA STORE step above
    // return hook // always resolve the promise chain with the context

    // [ [ { registration_count: '3',
    //   week_start: 2021-04-12T00:00:00.000Z } ],

    console.log(results[0][0])
    const registrationCount = parseInt(results[0][0]['registration_count'], 10)
    const weekStartDate = results[0][0]['week_start']
    console.log({ memberId, gymId, registrationCount, weekStartDate})
    await context.app.service('member-weekly-registration').create({
      memberId, gymId, registrationCount, weekStartDate
    })
    return context
  })

}


async function verifySpaceAvailable(context) {

  const eventId = context.data.eventId
  const model = context.app.service('event-member-registration').Model
  const count = await model.count({
    where: {eventId}
  })
  const event = await context.app.service('events').Model.findByPk(eventId)

  if (event.maximumAttendance !== null && count >= event.maximumAttendance) {
    throw new Error('This event is already full.')
  }

  return context
}

module.exports = {
  before: {
    all: [ authenticate('jwt'),  restrictAccessForGym() ],
    find: [customQuery({queries: queries})],
    get: [],
    create: [verifySpaceAvailable, assignCreatedBy],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [updateEventMemberRegistrationCount, updateMemberWeeklyRegistrationCount],
    update: [],
    patch: [],
    remove: [updateEventMemberRegistrationCount, updateMemberWeeklyRegistrationCount]
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
