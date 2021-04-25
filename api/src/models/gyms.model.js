// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const gyms = sequelizeClient.define('gyms', {
    // String id
    // String name
    // String description
    // String defaultTimezone
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    defaultTimezone: {
      type: DataTypes.STRING,
      // TODO: shouldn't be nullable
      allowNull: true
    },
    memberTags: {
      type: Sequelize.JSONB,
      allowNull: false
    },
    maximumWeeklyRegistrationPerMember: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true
      }
    }
  })

  // eslint-disable-next-line no-unused-vars
  gyms.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    gyms.belongsTo(models.users, {foreignKey: 'createdBy'})
    gyms.hasMany(models.user_gym_role)
  }

  return gyms
}
