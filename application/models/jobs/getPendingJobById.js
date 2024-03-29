import { pgClient } from "../../src/data-loaders/index.js";
import { randomUUID } from "crypto";
import { JOBS_TABLE, WORKERS_TABLE } from "../tables.js";
import { logger } from "../../src/logger/logger.js";
import { PENDING_STATUS } from "../../src/utils/constants.js";



export const getPendingJobById = async (id) => {
    logger.info(`Getting job by id: ${id}`)
    const result = {};
    try {
        const row = await pgClient(JOBS_TABLE)
            .where(`id`, id)
            .where('status', PENDING_STATUS)
        result.data = row
    } catch (e) {
        result.err = e;
        logger.error(e)
    }
    return result;
}