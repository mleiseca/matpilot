// Initializes the `gym-waiver-member-signature` service on path `/gym-waiver-member-signature`
const { GymWaiverMemberSignature } = require('./gym-waiver-member-signatures.class');
const createModel = require('../../models/gym-waiver-member-signatures.model');
const hooks = require('./gym-waiver-member-signatures.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/gym-waiver-member-signatures', new GymWaiverMemberSignature(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('gym-waiver-member-signatures');

  service.hooks(hooks);
};
