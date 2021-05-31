module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'gyms',
      'registrationMessage',
      {
        type: Sequelize.TEXT,
        allowNull: true
      }
    )
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('gyms', 'registrationMessage')
  }
}
