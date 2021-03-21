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
    create: [updateEventMemberRegistrationCount],
    update: [],
    patch: [],
    remove: [updateEventMemberRegistrationCount]
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
