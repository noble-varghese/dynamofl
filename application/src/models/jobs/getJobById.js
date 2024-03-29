import { pgClient } from "../../data-loaders/index.js";
import { randomUUID } from "crypto";
import { JOBS_TABLE, WORKERS_TABLE } from "../tables.js";
import { logger } from "../../logger/logger.js";



export const getJobById = async (id) => {
    logger.info(`Getting job by id: ${id}`)
    const result = {};
    try {
        const row = await pgClient(JOBS_TABLE)
            .where(`id`, id)
        result.data = row
    } catch (e) {
        result.err = e;
        logger.error(e)
    }
    return result;
}