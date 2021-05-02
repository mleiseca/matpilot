'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'events',
      'maximumAttendance',
      {
        type: Sequelize.INTEGER,
        defaultValue: null
      }
    )
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('events', 'maximumAttendance')
  }
}
