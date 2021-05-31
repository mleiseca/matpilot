const { authenticate } = require('@feathersjs/authentication').hooks
const mapCreateToUpsert = require('../../hooks/map-create-to-upsert')
const assignCreatedBy = require('../../hooks/created-by')
const { restrictAccessForGymWorkers, restrictAccessForGym } = require('../../hooks/authorization')


async function addMaximumAttendance(context) {
  const se = await context.app.service('scheduled-events').Model.findByPk(context.data.scheduledEventId)
  context.data.maximumAttendance = se.maximumAttendance
  return context
}

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [restrictAccessForGym()],
    get: [restrictAccessForGym()],
    create: [restrictAccessForGym(), // TODO: this create should check that the input better. You might
      // get a message like this:
      // 4231["create","events",{"scheduledEventId":5,"gymId":3,"title":"Daily class - limit 1","description":"","timezone":"America/Chicago",
      // "startDateTime":"2021-06-21T03:00:00.000Z","endDateTime":"2021-06-21T03:30:00.000Z"},{}]
      // TODO: we need to verify that the startDateTime is actually a time for that scheduled event
      assignCreatedBy, addMaximumAttendance,
      mapCreateToUpsert(context => {
        const { data } = context
        return { scheduledEventId: data.scheduledEventId, startDateTime: data.startDateTime}
      })
    ],
    update: [restrictAccessForGym()],
    patch: [restrictAccessForGym()],
    remove: [restrictAccessForGymWorkers()]
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
