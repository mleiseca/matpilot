// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const gymWaiverMemberSignature = sequelizeClient.define('gym_waiver_member_signatures', {
    waiverUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    waiverName: {
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
  gymWaiverMemberSignature.associate = function (models) {
    gymWaiverMemberSignature.belongsTo(models.gyms, {foreignKey: {allowNull: false}})
    gymWaiverMemberSignature.belongsTo(models.members, {foreignKey: {allowNull: false}})
    gymWaiverMemberSignature.belongsTo(models.gym_waivers, {foreignKey: {allowNull: false}})
    gymWaiverMemberSignature.belongsTo(models.users, {foreignKey: 'createdBy'})
  };

  return gymWaiverMemberSignature;
};
