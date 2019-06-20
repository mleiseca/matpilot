// Initializes the `eventMemberAttendance` service on path `/event-member-attendance`
const createService = require('feathers-sequelize')
const createModel = require('../../models/event-member-attendance.model')
const hooks = require('./event-member-attendance.hooks')

module.exports = function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/event-member-attendance', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('event-member-attendance')

  service.hooks(hooks)
}
