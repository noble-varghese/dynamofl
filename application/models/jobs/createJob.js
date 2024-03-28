import { pgClient } from "../../src/data-loaders/index.js";
import { randomUUID } from "crypto";
import { JOBS_TABLE } from "../tables.js";



export const createJob = async (data) => {
    const result = {};
    try {
        logger.info("Creating new job...")
        await pgClient(JOBS_TABLE).insert({
            ...data,
            id: randomUUID()
        })
    } catch (e) {
        result.err = e;
    }
    return result;
}   