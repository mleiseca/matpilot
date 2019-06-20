// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const userGymRole = sequelizeClient.define('user_gym_role', {
    role: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true
      }
    }
  })

  // eslint-disable-next-line no-unused-vars
  userGymRole.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    userGymRole.belongsTo(models.users, { foreignKey: { allowNull: false }})
    userGymRole.belongsTo(models.gyms,  { foreignKey: { allowNull: false }})
  }

  return userGymRole
}
