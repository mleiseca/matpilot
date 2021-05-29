'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'gym_waiver_member_signatures',
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
        waiverUrl: {
          type: Sequelize.STRING,
          allowNull: false
        },
        waiverName: {
          type: Sequelize.STRING,
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
          onDelete: 'set null',
          allowNull: false
        },
        gymWaiverId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'gym_waivers',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'set null',
          allowNull: false
        },
        memberId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'members',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'set null',
          allowNull: false
        },
      }
    ).then(() =>
      queryInterface.addIndex('gym_waiver_member_signatures', ['memberId', 'gymWaiverId'], {
        type: 'UNIQUE',
        name: 'gym_waiver_member_signatures_member_id_waiver_id'
      }))
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.dropTable('gym_waiver_member_signatures')
    ])
  }
};

