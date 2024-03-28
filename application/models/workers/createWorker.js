import { pgClient } from "../../src/data-loaders/index.js";
import { randomUUID } from "crypto";
import { WORKERS_TABLE } from "../tables.js";
import { logger } from "../../src/logger/logger.js";



export const createWorkers = async (data) => {
    const result = {};
    try {
        await pgClient(WORKERS_TABLE).insert(data)
    } catch (e) {
        result.err = e;
        logger.info(e)
    }
    return result;
}