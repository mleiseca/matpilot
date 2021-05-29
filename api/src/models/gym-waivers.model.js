// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const gymWaivers = sequelizeClient.define('gym_waivers', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contents: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  gymWaivers.associate = function (models) {
    gymWaivers.belongsTo(models.gyms)
  };

  return gymWaivers;
};


