import { header, validationResult } from "express-validator"
import responseHandler from "../../middlewares/responseHandler.js"
import ErrorHandlerClass from "../../utils/errorHandlerClass.js"
import { CLIENT_ERROR, FORBIDDEN, NOT_FOUND, SERVER_ERROR } from "../../utils/custom-error-codes.js"
import { getJobStatus } from "../../models/jobs/getJobStatus.js"
import { redisQueueLength } from "../../utils/redisUtils.js"
import { inputCsvFilePath, outputFolderPath } from "../../models/jobs/updateJobAndSendToQueue.js"
import fs from "fs"
import { logger } from "../../logger/logger.js"
import { getJobById } from "../../models/jobs/getJobById.js"
import { parse } from 'csv-parse';
import path from 'path';
import { JOB_STATUS_COMPLETE } from "../../utils/constants.js"


const arrayToCSV = (data) => {
    return data.map(row => row.join(',')).join('\n');
}

export const generateOutputCSV = async (jobId, fileNum) => {
    logger.info('1')
    const folderPath = outputFolderPath(jobId)
    logger.info(folderPath)
    logger.info('2')
    const files = fs.readdirSync(folderPath);
    logger.info('3')

    const csvFiles = files.filter(file => path.extname(file).toLowerCase() === '.csv');
    logger.info('4')

    const allData = [];

    for (const file of csvFiles) {
        logger.info(`file path: ${file}`)
        const parser = fs.createReadStream(`${folderPath}/${file}`).pipe(parse({ delimiter: ',' }));
        for await (const record of parser) {
            allData.push(record);
        }
    }
    logger.info("Getting the average value")
    let avg = allData[0]
    let newData = [avg]
    for (const data of allData.slice(1)) {
        logger.info(data, avg)
        // Adds the corresponding elements in each position.
        avg = avg.map((num, index) => parseFloat(num) + parseFloat(data[index]));
        newData.push(data.map(num => parseInt(num * fileNum)))
    }

    newData.push(avg)

    return arrayToCSV(newData)
}

const checkFileExists = (jobId) => {
    const folder = outputFolderPath(jobId)
    logger.warn(path)
    return fs.existsSync(folder)
}


export const outputFileHandler = async (req, res, next) => {
    logger.info("Generating output csv")
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // Return 400 status code with validation errors
        return next(
            new ErrorHandlerClass(CLIENT_ERROR.statusCode, CLIENT_ERROR.message, { errors: errors.array() })
        )
    }
    const store = {
        jobId: req.params.job_id
    }
    const result1 = await getJobById(store.jobId)
    if (result1.err) {
        return next(
            new ErrorHandlerClass(SERVER_ERROR.statusCode, SERVER_ERROR.message, result1.err)
        )
    }

    if (result1.data == undefined || result1.data.length == 0) {
        return next(
            new ErrorHandlerClass(FORBIDDEN.statusCode, FORBIDDEN.message, "job doesn't exist")
        )
    }

    if (result1.data[0]['status'] != JOB_STATUS_COMPLETE) {
        return next(
            new ErrorHandlerClass(FORBIDDEN.statusCode, FORBIDDEN.message, "Job is still processing")
        )
    }

    const isFileExists = checkFileExists(store.jobId)
    if (!isFileExists) {
        return next(
            new ErrorHandlerClass(NOT_FOUND.statusCode, NOT_FOUND.message, "The job is still processing or is not complete.")
        )
    }
    const file_num = result1.data[0]['files_num']
    logger.info("Reaches this point ....")

    res.setHeader('Content-Type', 'text/csv');
    // Set Content-Disposition header to indicate attachment and file name
    res.setHeader('Content-Disposition', 'attachment; filename="output_file.csv"');
    const csvData = await generateOutputCSV(store.jobId, file_num)
    res.send(csvData);
    return
}