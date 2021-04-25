// Initializes the `member-weekly-registration` service on path `/member-weekly-registration`
const { MemberWeeklyRegistration } = require('./member-weekly-registration.class');
const createModel = require('../../models/member-weekly-registration.model');
const hooks = require('./member-weekly-registration.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/member-weekly-registration', new MemberWeeklyRegistration(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('member-weekly-registration');

  service.hooks(hooks);
};
