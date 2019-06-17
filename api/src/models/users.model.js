// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const users = sequelizeClient.define('users', {
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    googleId: { type: Sequelize.STRING },

    facebookId: { type: Sequelize.STRING },

    isVerified: { type: Sequelize.BOOLEAN },
    verifyToken: { type: Sequelize.STRING },
    verifyExpires: { type: Sequelize.DATE },
    verifyChanges: { type: Sequelize.JSON },
    resetToken: { type: Sequelize.STRING },
    resetExpires: { type: Sequelize.DATE }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  users.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    //users.belongsToMany(models.gyms, {through: 'UserGym', through: 'user_gyms'});
    users.hasMany(models.user_gym_role, {foreignKey: {allowNull: false}} );
  };

  return users;
};
