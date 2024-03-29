import { pgClient } from "../../src/data-loaders/index.js";
import { randomUUID } from "crypto";
import { JOBS_TABLE, WORKERS_TABLE } from "../tables.js";
import { logger } from "../../src/logger/logger.js";



export const getJobStatus = async (id) => {
    logger.info(`Getting job Status jobs with id: ${id} `)
    const result = {};
    try {
        const row = await pgClient(JOBS_TABLE)
            .select(
                `${JOBS_TABLE}.*`,
                `${WORKERS_TABLE}.id as worker_id`,
                `${WORKERS_TABLE}.status as worker_status`,
                `${WORKERS_TABLE}.queue_name as worker_queue_name`,
                `${WORKERS_TABLE}.created_at as worker_created_at`,
                `${WORKERS_TABLE}.updated_at as worker_updated_at`,

            )
            .join(WORKERS_TABLE, `${JOBS_TABLE}.id`, `${WORKERS_TABLE}.job_id`)
            .where(`${JOBS_TABLE}.id`, id)
        
        result.data = row

    } catch (e) {
        result.err = e;
    }
    return result;
}