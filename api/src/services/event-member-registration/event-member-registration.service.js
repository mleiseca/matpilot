// Initializes the `event-member-registration` service on path `/event-member-registration`
const createService = require('feathers-sequelize');
const createModel = require('../../models/event-member-registration.model');
const hooks = require('./event-member-registration.hooks');
const filters = require('./event-member-registration.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/event-member-registration', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('event-member-registration');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
