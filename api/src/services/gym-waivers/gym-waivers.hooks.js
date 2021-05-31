const { authenticate } = require('@feathersjs/authentication').hooks;
const assignCreatedBy = require('../../hooks/created-by')
const restrictAccessForGym = require('../../hooks/authorization').restrictAccessForGym


module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [restrictAccessForGym()],
    get: [restrictAccessForGym()],
    create: [assignCreatedBy, restrictAccessForGym({ role: ['OWNER', 'ADMIN'] })],
    update: [restrictAccessForGym({ role: ['OWNER', 'ADMIN'] })],
    patch: [restrictAccessForGym({ role: ['OWNER', 'ADMIN'] })],
    remove: [restrictAccessForGym({ role: ['OWNER', 'ADMIN'] })]
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
