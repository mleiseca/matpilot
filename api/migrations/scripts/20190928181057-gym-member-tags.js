'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('gyms', 'memberTags',
        {
          type: Sequelize.JSONB,
          defaultValue: [],
          allowNull: false
        }
      ),

      queryInterface.addColumn('members', 'tags',
        {
          type: Sequelize.JSONB,
          defaultValue: [],
          allowNull: false
        }
      )
    ])
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('gyms', 'memberTags'),
      queryInterface.removeColumn('members', 'tags')
    ])

  }
};
