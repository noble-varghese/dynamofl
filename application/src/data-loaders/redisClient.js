import knex from 'knex';
import { config } from '../configuration/index.js';
import { logger } from '../logger/logger.js';
import { createClient } from 'redis';


export const initClient = async () => {
    try {
        const client = await createClient({
            url: config.redis.url ? config.redis.url : `redis://${config.redis.host}:${config.redis.port}`, // Replace with your primary endpoint
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