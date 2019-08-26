'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'members',
        'nickname',
        Sequelize.STRING
      ),

      queryInterface.addColumn(
        'members',
        'lowerNickname',
        Sequelize.STRING
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('members', 'nickname'),
      queryInterface.removeColumn('members', 'lowerNickname')
    ])

  }
};
