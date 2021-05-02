'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'events',
      'registrationCount',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      }
    )
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('events', 'registrationCount')
  }
}
