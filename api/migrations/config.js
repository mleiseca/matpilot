

module.exports = {
  development: {
    username: 'postgres',
    password: '',
    database: 'matpilot_dev',
    host: '127.0.0.1',
    port: '5433',
    dialect: 'postgres',
    migrationStorageTableName: '_migrations'
  },
  test: {
    username: 'postgres',
    password: '',
    database: 'matpilot_dev',
    host: '127.0.0.1',
    dialect: 'postgres',
    migrationStorageTableName: '_migrations'
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    migrationStorageTableName: '_migrations',
    dialectOptions: {
      ssl: true
    }
  }
};
