import { pgClient } from "../../src/data-loaders/index.js";
import { randomUUID } from "crypto";
import { WORKERS_TABLE } from "../tables.js";
import { logger } from "../../src/logger/logger.js";


/**
 * Creates default workers for the application based on the user-input
 * @param {*} num 
 * @returns 
 */
export const bulkInsertNewWorkers = async (data) => {
    const result = {};
    try {
        await pgClient('workers').insert(data)
    } catch (e) {
        result.err = e;
        logger.error(e)
    }
    return result;
}