const { authenticate } = require('@feathersjs/authentication').hooks
const mapCreateToUpsert = require('../../hooks/map-create-to-upsert')

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [
      mapCreateToUpsert(context => {
        const { data } = context
        // This returns the select used to find an existing row
        return { memberId: data.memberId, gymId: data.gymId, weekStartDate: data.weekStartDate}
      })],

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
