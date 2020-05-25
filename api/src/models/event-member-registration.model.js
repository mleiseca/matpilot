// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes  /* eslint-disable-line */;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const eventMemberRegistration = sequelizeClient.define('event_member_registration', {

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

  eventMemberRegistration.associate = function (models) {
    eventMemberRegistration.belongsTo(models.gyms)
    eventMemberRegistration.belongsTo(models.events)
    eventMemberRegistration.belongsTo(models.members)
    eventMemberRegistration.belongsTo(models.users, {foreignKey: 'createdBy'})
  };

  return eventMemberRegistration;
};
