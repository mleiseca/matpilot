// Initializes the `gyms` service on path `/gyms`
const createService = require('feathers-sequelize');
const createModel = require('../../models/gyms.model');
const hooks = require('./gyms.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gyms', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('gyms');

  service.hooks(hooks);
};
