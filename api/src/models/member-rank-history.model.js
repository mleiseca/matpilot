// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const memberRankHistory = sequelizeClient.define('member_rank_history', {
    newRank: {
      type: DataTypes.STRING,
      allowNull: false
    },
    awardDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true
      }
    }
  })

  memberRankHistory.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    memberRankHistory.belongsTo(models.gyms)
    memberRankHistory.belongsTo(models.members)
    memberRankHistory.belongsTo(models.users, {foreignKey: 'createdBy'})
  }

  return memberRankHistory
}
