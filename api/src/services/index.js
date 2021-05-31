const gyms = require('./gyms/gyms.service.js')
const events = require('./events/events.service.js')
const eventMemberAttendance = require('./event-member-attendance/event-member-attendance.service.js')
const members = require('./members/members.service.js')
const scheduledEvents = require('./scheduled-events/scheduled-events.service.js')
const users = require('./users/users.service.js')
const userGymRole = require('./user-gym-role/user-gym-role.service.js')
const mailer = require('./mailer/mailer.service.js')
const authmanagement = require('./authmanagement/authmanagement.service.js')
const memberRankHistory = require('./member-rank-history/member-rank-history.service.js')
const eventMemberRegistration = require('./event-member-registration/event-member-registration.service.js')
const memberWeeklyRegistration = require('./member-weekly-registration/member-weekly-registration.service.js')
const gymWaivers = require('./gym-waivers/gym-waivers.service.js');
const gymWaiverMemberSignatures = require('./gym-waiver-member-signatures/gym-waiver-member-signatures.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(gyms)
  app.configure(events)
  app.configure(eventMemberAttendance)
  app.configure(eventMemberRegistration)
  app.configure(members)
  app.configure(scheduledEvents)
  app.configure(users)
  app.configure(userGymRole)
  app.configure(memberRankHistory)
  app.configure(memberWeeklyRegistration)
  app.configure(gymWaivers);
  app.configure(gymWaiverMemberSignatures);

  // https://github.com/feathersjs-ecosystem/feathers-sequelize/issues/20
  const sequelizeClient = app.get('sequelizeClient')
  Object.values(sequelizeClient.models)
    .filter(model => model.associate)
    .forEach(model => model.associate(sequelizeClient.models))

  app.configure(mailer)
  app.configure(authmanagement)
}
