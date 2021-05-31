'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'gyms',
      'active',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    )
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('gyms', 'active')
  }
}


