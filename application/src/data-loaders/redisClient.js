import knex from 'knex';
import { config } from '../configuration/index.js';
import { logger } from '../logger/logger.js';
import { createClient } from 'redis';


export const initClient = async () => {
    try {
        const client = await createClient({
            url: 'redis://test.g369sf.ng.0001.apse1.cache.amazonaws.com:6379', // Replace with your primary endpoint
        }).connect();

        await client.ping()

        // logger.info('Connected to Redis')
        return client
    } catch (err) {
        logger.error(`Error connecting to Redis: ${err}`)
        process.exit(1)

    }
};

const client = await initClient()
export default client