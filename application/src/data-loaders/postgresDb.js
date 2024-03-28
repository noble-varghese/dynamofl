import knex from 'knex';
import { config } from '../configuration/index.js';
import { logger } from '../logger/logger.js';

export const initPostgres = async () => {
    try {
        const pg = knex({
            client: 'pg',
            connection: {
                connectionString: config.postgres.database_url,
                host: config.postgres.host,
                port: config.postgres.port,
                user: config.postgres.user,
                database: config.postgres.database,
                password: config.postgres.password,
                ssl: {
                    rejectUnauthorized: false, // This is required for RDS Proxy connections
                },
                // ssl: config.postgres.ssl ? { rejectUnauthorized: false } : false,
            },
        });
        logger.info('Connected to PostgresDb')
        return pg
    } catch (err) {
        logger.error(`Error connecting to Postres: ${err}`)
        process.exit(1)

    }
};

const client = await initPostgres()
export default client