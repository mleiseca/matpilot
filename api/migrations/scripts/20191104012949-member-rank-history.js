'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'members',
        'rank',
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        'members',
        'rankAwardDate',
        Sequelize.DATE
      ),
      queryInterface.createTable(
        'member_rank_history',
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
          newRank: {
            type: Sequelize.STRING,
            allowNull: false
          },
          awardDate: {
            type: Sequelize.DATE,
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
      queryInterface.removeColumn('members', 'rank'),
      queryInterface.removeColumn('members', 'rankAwardDate'),
      queryInterface.dropTable('member_rank_history')
    ])
  }
};
