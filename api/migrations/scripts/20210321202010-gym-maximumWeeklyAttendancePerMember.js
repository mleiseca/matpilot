'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'gyms',
      'maximumWeeklyRegistrationPerMember',
      {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    )
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('gyms', 'maximumWeeklyRegistrationPerMember')
  }
}
