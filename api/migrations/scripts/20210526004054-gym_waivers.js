'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'gym_waivers',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        contents: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        //foreign key usage
        gymId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'gyms',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'set null'
        },
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.dropTable('gym_waivers')
    ])
  }
};

