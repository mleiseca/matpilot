const { authenticate } = require('@feathersjs/authentication').hooks;
const hydrate = require('feathers-sequelize/hooks/hydrate');
const queryWithCurrentUser = require('../../hooks/authorization').queryWithCurrentUser;

function includeGym() {
  return function (hook) {
    const model = hook.app.service('gyms').Model;
    const association = { include: [{ model: model, attributes: ['id', 'name', 'description'] }] };

    switch (hook.type) {
      case 'before':
        hook.params.sequelize = Object.assign(association, { raw: false });
        return Promise.resolve(hook);
        break;

      case 'after':
        hydrate( association ).call(this, hook);
        break;
    }
  }
}

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [queryWithCurrentUser({ idField: 'id', as: 'userId' }), includeGym()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [includeGym()],
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
