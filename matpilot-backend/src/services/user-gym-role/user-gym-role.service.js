// Initializes the `UserGymRole` service on path `/user-gym-role`
const createService = require('feathers-sequelize');
const createModel = require('../../models/user-gym-role.model');
const hooks = require('./user-gym-role.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/user-gym-role', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-gym-role');

  service.hooks(hooks);
};
