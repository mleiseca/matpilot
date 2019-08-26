// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const members = sequelizeClient.define('members', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lowerFirstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lowerNickname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lowerLastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    emergencyContacts: {
      type: Sequelize.JSONB,
      allowNull: false
    },
    guardianContacts: {
      type: Sequelize.JSONB,
      allowNull: false
    },
    waiverSignedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    waiverUrl: {
      type: DataTypes.STRING,
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
  members.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    // TODO: this should be not-nullable
    members.belongsTo(models.gyms)
    members.belongsTo(models.users, {foreignKey: 'createdBy'})
    members.hasMany(models.event_member_attendance, {foreignKey: {allowNull: false}} )
  }

  return members
}
