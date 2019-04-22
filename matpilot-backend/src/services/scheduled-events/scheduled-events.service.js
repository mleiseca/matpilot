// Initializes the `scheduledEvents` service on path `/scheduled-events`
const createService = require('feathers-sequelize');
const createModel = require('../../models/scheduled-events.model');
const hooks = require('./scheduled-events.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/scheduled-events', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('scheduled-events');

  service.hooks(hooks);
};
