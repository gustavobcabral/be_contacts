module.exports = {
  development: {
    client: 'postgresql',
    debud: true,
    connection: {
      database: 'contacts',
      user: 'postgres',
      password: '52425242'
    },
    port: 5432,
    define: {
      charset: 'utf8',
      dialectOptions: { collate: 'utf8_general_ci' }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/src/database/migrations'
    },
    seeds: {
      tableName: 'knex_seeds',
      directory: __dirname + '/src/database/seeds'
    }
  },
  test: {
    client: 'postgresql',
    connection: {
      database: 'contacts-test',
      user: 'postgres',
      password: '52425242'
    },
    port: 5432,
    define: {
      charset: 'utf8',
      dialectOptions: { collate: 'utf8_general_ci' }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/migrations'
    },
    seeds: {
      tableName: 'knex_migrations',
      directory: __dirname + '/seeds'
    }
  },
  production: {
    dialect: 'postgres',
    // eslint-disable-next-line @typescript-eslint/camelcase
    use_env_variable: 'DATABASE_URL',
    port: 5432,
    define: {
      charset: 'utf8',
      dialectOptions: { collate: 'utf8_general_ci' }
    },
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData',
    dialectOptions: {
      ssl: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
}
