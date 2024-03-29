import { pgClient } from "../../src/data-loaders/index.js";
import { JOBS_TABLE } from "../tables.js";
import { logger } from "../../src/logger/logger.js";
import { redisRPush } from "../../src/utils/redisUtils.js";
import { generateRandomNumbers } from "../../src/utils/generateRandomNumbers.js";
import { JOB_PROCESS_MESSAGE } from "../../src/utils/constants.js";

const createFilesAndAddJobsToQueue = async (queueName, jobId, files, randNumCount) => {

    for (const i = 0; i < files; i++) {
        const nums = generateRandomNumbers(randNumCount)
        await redisRPush(queueName, {
            message: JOB_PROCESS_MESSAGE,
            job_id: jobId,
            file_num: files,
            num_count: randNumCount,
            random_nums: nums,
        })
    }

}


export const updateJobAndSendToQueue = async (queueName, id, data) => {
    const result = {}
    // Begin a transaction
    const trx = await pgClient.transaction()
    try {
        // Update the jobs with files and count.
        await trx(JOBS_TABLE)
            .update(data)
            .where('id', id)

        // Create files and send it to the queue.
        await createFilesAndAddJobsToQueue(queueName, id, data.files_num, data.rand_num_count)

        await trx.commit()
    } catch (err) {
        await trx.rollback()
        logger.error("Rollback in progress.", err)
        res.err = err
    }
    return result;
}   