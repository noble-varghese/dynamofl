import { validationResult } from "express-validator"
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

const arrayToCSV = (data) => {
    return data.map(row => row.join(',')).join('\n');
}

export const generateInputFile = async (jobId) => {
    const records = [];
    const filePath = inputCsvFilePath(jobId)
    const parser = fs.createReadStream(filePath).pipe(parse({ delimiter: ',' }));

    for await (const record of parser) {
        records.push(record);
    }
    return arrayToCSV(records)
}

const checkFileExists = (jobId) => {
    const path = inputCsvFilePath(jobId)
    logger.warn(path)

    return fs.existsSync(path)
}

export const inputFileHandler = async (req, res, next) => {
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

    const isFileExists = checkFileExists(store.jobId)
    if (!isFileExists) {
        return next(
            new ErrorHandlerClass(NOT_FOUND.statusCode, NOT_FOUND.message, "The job is still processing or is not complete.")
        )
    }
    logger.info("Reaches this point ....")

    res.setHeader('Content-Type', 'text/csv');
    // Set Content-Disposition header to indicate attachment and file name
    res.setHeader('Content-Disposition', 'attachment; filename="input_file.csv"');
    const csvData = await generateInputFile(store.jobId)
    res.send(csvData);
    return
}