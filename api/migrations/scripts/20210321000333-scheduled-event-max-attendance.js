'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'scheduled_events',
      'maximumAttendance',
      {
        type: Sequelize.INTEGER,
        defaultValue: null
      }
    )
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('scheduled_events', 'maximumAttendance')
  }
}
