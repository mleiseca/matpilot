// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const eventMemberAttendance = sequelizeClient.define('event_member_attendance', {
    // no additional fields yet....
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['memberId', 'eventId']
      }
    ]
  });

  // eslint-disable-next-line no-unused-vars
  eventMemberAttendance.associate = function (models) {
    eventMemberAttendance.belongsTo(models.gyms);
    eventMemberAttendance.belongsTo(models.events);
    eventMemberAttendance.belongsTo(models.members);
    eventMemberAttendance.belongsTo(models.users, {foreignKey: 'createdBy'});
  };

  return eventMemberAttendance;
};
