'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'gym_waiver_member_signatures',
      'createdBy',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'set null'
      }
    ).then(() =>
      queryInterface.addColumn(
        'gym_waivers',
        'createdBy',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'set null'
        })
    )
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('gym_waiver_member_signatures', 'createdBy').then(() =>
      queryInterface.removeColumn('gym_waivers', 'createdBy')
    )
  }
}


