// Initializes the `gym-waivers` service on path `/gym-waivers`
const { GymWaivers } = require('./gym-waivers.class');
const createModel = require('../../models/gym-waivers.model');
const hooks = require('./gym-waivers.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/gym-waivers', new GymWaivers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('gym-waivers');

  service.hooks(hooks);
};
