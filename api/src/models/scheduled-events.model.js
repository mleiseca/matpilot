// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const scheduledEvents = sequelizeClient.define('scheduled_events', {
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timezone: {
      type: DataTypes.STRING,
      // TODO: shouldn't be nullable
      allowNull: true
    },
    rrules: {
      type: DataTypes.STRING,
      // TODO: shouldn't be nullable
      allowNull: true
    },
    untilDateTime: {
      type: DataTypes.TIME,
      // TODO: shouldn't be nullable
      allowNull: true
    },
      endDateTime: {
        type: DataTypes.TIME,
        // TODO: shouldn't be nullable
        allowNull: true
      }
    }
  , {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  scheduledEvents.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    scheduledEvents.belongsTo(models.gyms);
    scheduledEvents.belongsTo(models.users, {foreignKey: 'createdBy'});
  };

  return scheduledEvents;
};
