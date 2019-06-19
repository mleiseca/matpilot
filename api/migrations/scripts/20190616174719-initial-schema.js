'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let schemaSql = fs.readFileSync(path.join(__dirname, '/../schema/schema.sql'), 'utf8')
    return queryInterface.sequelize.query(schemaSql)
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
