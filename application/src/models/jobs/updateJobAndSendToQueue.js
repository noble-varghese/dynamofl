import { pgClient } from "../../data-loaders/index.js";
import { JOBS_TABLE } from "../tables.js";
import { logger } from "../../logger/logger.js";
import { redisRPush } from "../../utils/redisUtils.js";
import { generateRandomNumbers } from "../../utils/generateRandomNumbers.js";
import { IN_PROGRESS, JOB_PROCESS_MESSAGE } from "../../utils/constants.js";
import fs from "fs"


const arrayToCSV = (data) => {
    return data.map(row => row.join(',')).join('\n');
}

const createFolder = (folderPath) => {
    fs.mkdirSync(folderPath, { recursive: true });
}

const saveCSVToDisk = (csvData, filename) => {
    // Save CSV data to file
    fs.writeFileSync(filePath, csvData);
    logger.info(`CSV file saved as ${filename}`);
}

const createFilesAndAddJobsToQueue = async (queueName, jobId, files, randNumCount) => {
    const data = []
    for (let i = 0; i < files; i++) {
        const nums = generateRandomNumbers(randNumCount)
        data.push(nums)
        await redisRPush(queueName, JSON.stringify({
            message: JOB_PROCESS_MESSAGE,
            job_id: jobId,
            file_num: files,
            num_count: randNumCount,
            random_nums: nums,
        }))
    }
    // Create outputfiles folder
    createFolder(`./job_files/${jobId}/output_data/`)

    // Create input files folder
    createFolder(`./job_files/${jobId}/input_data/`)

    // Save the input file in the path
    const fileName = `./job_files/${jobId}/input_data/input_file.csv`
    saveCSVToDisk(arrayToCSV(data), fileName)
}


export const updateJobAndSendToQueue = async (queueName, id, data) => {
    const result = {}
    // Begin a transaction
    const trx = await pgClient.transaction()
    try {
        // Update the jobs with files and count.
        await trx(JOBS_TABLE)
            .update({
                ...data,
                status: IN_PROGRESS
            })
            .where('id', id)


        // Create files and send it to the queue.
        await createFilesAndAddJobsToQueue(queueName, id, data.files_num, data.rand_num_count)

        await trx.commit()
    } catch (err) {
        await trx.rollback()
        logger.error("Rollback in progress.", err)
        result.err = err
    }
    return result;
}   