import { pgClient } from "../../src/data-loaders/index.js";
import { randomUUID } from "crypto";
import { JOBS_TABLE } from "../tables.js";
import { logger } from "../../src/logger/logger.js";
import { redisRPush } from "../../src/utils/redisUtils.js";
import { generateRandomNumbers } from "../../src/utils/generateRandomNumbers.js";
import { JOB_PROCESS_MESSAGE } from "../../src/utils/constants.js";

const createAndSendToOrchestrator = async (num) => {
    logger.debug("starting createAndSendToOrchestrator..")
    const res = {}
    // Begin a transaction
    const trx = await pgClient.transaction()
    try {
        // construct the jobs for pg

        const jobId = randomUUID()
        const jobName = getRandomName()
        const queueName = randomUUID()
        const workerIds = []
        await trx(JOBS_TABLE).insert({
            name: jobName,
            worker_count: num,
            queue_name: queueName,
            id: jobId
        })
        const data = []
        for (let i = 0; i < num; i++) {
            const workerId = randomUUID()
            workerIds.push(workerId)
            data.push({
                job_id: jobId,
                queue_name: queueName,
                id: workerId,
            })
        }


        // Create Jobs and add to postgres
        await trx(WORKERS_TABLE).insert(data)

        // Send the jobs to orchestrator queue
        for (const workerId of workerIds) {
            await redisRPush(WORKER_CREATION_QUEUE, JSON.stringify({
                message: WORKER_CREATION_MESSAGE,
                job_id: jobId,
                worker_id: workerId,
                queue_name: queueName

            }))
        }

        res.data = {
            jobId,
            jobName,
            queueName,
            workerIds
        }

        await trx.commit()
    } catch (err) {
        await trx.rollback()
        logger.error("Rollback in progress.", err)
        res.err = err
    }
    logger.debug("success on createAndSendToOrchestrator")
    return res
}

const createFilesAndAddJobsToQueue = async (queueName, jobId, files, randNumCount) => {

    for (const i = 0; i < files; i++) {
        const nums = generateRandomNumbers(randNumCount)
        redisRPush(queueName, {
            message: JOB_PROCESS_MESSAGE,
            job_id: jobId,
            file_num: files,
            num_count: randNumCount,
            random_nums: nums,
        })
    }

}


export const updateJobAndSendToQueue = async (queueName, id, data) => {
    const res = {}
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