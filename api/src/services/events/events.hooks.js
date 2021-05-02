const { authenticate } = require('@feathersjs/authentication').hooks
const mapCreateToUpsert = require('../../hooks/map-create-to-upsert')
const assignCreatedBy = require('../../hooks/created-by')
const restrictAccessForGym = require('../../hooks/authorization').restrictAccessForGym

async function addMaximumAttendance(context) {
  const se = await context.app.service('scheduled-events').Model.findByPk(context.data.scheduledEventId)
  context.data.maximumAttendance = se.maximumAttendance
  return context
}

module.exports = {
  before: {
    all: [ authenticate('jwt'), restrictAccessForGym() ],
    find: [],
    get: [],
    create: [assignCreatedBy, addMaximumAttendance,
      mapCreateToUpsert(context => {
        const { data } = context
        return { scheduledEventId: data.scheduledEventId, startDateTime: data.startDateTime}
      })
    ],
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
