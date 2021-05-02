'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addIndex('event_member_registration', ['memberId','eventId'], {
        type: 'UNIQUE',
        name: 'event_member_registrations_member_id_event_id'
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeIndex('event_member_registration', 'event_member_registrations_member_id_event_id')
    ])
  }
};
