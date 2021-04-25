// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const memberWeeklyRegistration = sequelizeClient.define('member_weekly_registration', {
    weekStartDate : {
      type: Sequelize.DATE,
      allowNull: false
    },
    registrationCount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['memberId', 'weekStartDate']
      }
    ]
  });

  // eslint-disable-next-line no-unused-vars
  memberWeeklyRegistration.associate = function (models) {
    memberWeeklyRegistration.belongsTo(models.members)
    memberWeeklyRegistration.belongsTo(models.gyms)
  };

  return memberWeeklyRegistration;
};
