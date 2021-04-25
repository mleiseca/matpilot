'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'member_weekly_registration',
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
        weekStartDate : {
          type: Sequelize.DATE,
          allowNull: false
        },
        registrationCount: {
          type: Sequelize.INTEGER,
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
      }
    ).then(() =>
      queryInterface.addIndex('member_weekly_registration', ['memberId','weekStartDate'], {
        type: 'UNIQUE',
        name: 'member_weekly_registration_memberId_weekStartDate'
      })
    )
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.dropTable('member_weekly_registration')
    ])
  }
}
