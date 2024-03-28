import { pgClient } from "../../src/data-loaders/index.js";
import { randomUUID } from "crypto";
import { JOBS_TABLE, WORKERS_TABLE } from "../tables.js";



export const getJobStatus = async (id) => {
    const result = {};
    try {
        logger.info("Creating new job...")
        const row = await pgClient(JOBS_TABLE)
            .join(WORKERS_TABLE, `${JOBS_TABLE}.id`, `${WORKERS_TABLE}.job_id`)
            .where(`${JOBS_TABLE}.id`, id)

        result.data = row

    } catch (e) {
        result.err = e;
    }
    return result;
}