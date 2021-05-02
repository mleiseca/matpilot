'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.createTable(
        'event_member_registration',
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

          // interesting columns
          // none

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
          eventId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'events',
              key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'set null'
          },
          memberId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'members',
              key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'set null'
          },
          createdBy: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'set null'
          }
        }
      )

    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.dropTable('event_member_registration')
    ])
  }
};
