import { pgClient } from "../../src/data-loaders/index.js";
import { randomUUID } from "crypto";
import { JOBS_TABLE } from "../tables.js";
import { logger } from "../../src/logger/logger.js";



export const updateJob = async (id, data) => {
    const result = {};
    try {
        logger.info("Creating new job...")
        await pgClient(JOBS_TABLE)
            .update(data)
            .where('id', id)
    } catch (e) {
        result.err = e;
        logger.error(e)
    }
    return result;
}   