// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {

  development: {
    client: 'postgresql',
    connection: {
      database: 'test',
      user: 'postgres',
      password: 'password',
      ssl: {
        rejectUnauthorized: false, // This is required for RDS Proxy connections
      },
      host: 'database-1.c3wga62kmum9.ap-southeast-1.rds.amazonaws.com'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'test',
      user: 'postgres',
      password: '',
      host: 'localhost'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'test',
      user: 'postgres',
      password: '',
      host: 'localhost'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
