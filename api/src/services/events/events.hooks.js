const { authenticate } = require('@feathersjs/authentication').hooks
const mapCreateToUpsert = require('../../hooks/map-create-to-upsert')
const assignCreatedBy = require('../../hooks/created-by')
const restrictAccessForGym = require('../../hooks/authorization').restrictAccessForGym

module.exports = {
  before: {
    all: [ authenticate('jwt'), restrictAccessForGym() ],
    find: [],
    get: [],
    create: [assignCreatedBy,
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
