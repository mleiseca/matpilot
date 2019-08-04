const Sequelize = require('sequelize')
const logger = require('./logger')


module.exports = function (app) {
  const connectionString = process.env.DB_URL || app.get('postgres')
  const useSslEnv = process.env.DB_DIALECT_OPTIONS_SSL

  let dbOptions = {
    dialect: 'postgres',
    logging: false,
    operatorsAliases: false,
    define: {
      freezeTableName: true
    }
  }

  let useSsl = true
  if (useSslEnv !== undefined) {
    logger.info('use SSL (DB_DIALECT_OPTIONS_SSL)? %s', process.env.DB_DIALECT_OPTIONS_SSL)
    useSsl = useSslEnv === 'true'
  }
  if (useSsl === true) {
    dbOptions.dialectOptions = {ssl: useSsl}
  }

  logger.info('dboptions: %o', dbOptions)
  const sequelize = new Sequelize(connectionString, dbOptions)
  const oldSetup = app.setup

  app.set('sequelizeClient', sequelize)

  app.setup = function (...args) {
    const result = oldSetup.apply(this, args)

    // Set up data relationships
    const models = sequelize.models
    Object.keys(models).forEach(name => {
      if ('associate' in models[name]) {
        models[name].associate(models)
      }
    })

    // Sync to the database
    // sequelize.sync();

    return result
  }
}
