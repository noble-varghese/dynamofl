import { pgClient } from "../../src/data-loaders/index.js";
import { randomUUID } from "crypto";
import { JOBS_TABLE, WORKERS_TABLE } from "../tables.js";
import { logger } from "../../src/logger/logger.js";



export const updateWorkerStatus = async (id, data) => {
    logger.info('Updating worker: ', id)
    const result = {};
    try {
        const row = await pgClient(WORKERS_TABLE)
            .update(data)
            .where(`id`, id)

        result.data = row

    } catch (e) {
        result.err = e;
    }
    return result;
}