import { pgClient } from "../../data-loaders/index.js";
import { JOBS_TABLE, WORKERS_TABLE } from "../tables.js";
import { logger } from "../../logger/logger.js";



export const getAllJobs = async () => {
    logger.info(`Getting all jobs.. `)
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
            .orderBy(`${JOBS_TABLE}.created_at`,"desc")


        result.data = row
    }
    catch (e) {
        result.err = e;
    }
    return result;
}