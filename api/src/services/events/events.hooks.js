const { authenticate } = require('@feathersjs/authentication').hooks;
const mapCreateToUpsert = require('../../hooks/map-create-to-upsert')
const assignCreatedBy = require('../../hooks/created-by')

const logger = require('winston')

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [assignCreatedBy,
      mapCreateToUpsert(context => {
        const { data } = context
        logger.info(data)
        return { address: data.address }
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
};
