import { validationResult } from "express-validator"
import responseHandler from "../../middlewares/responseHandler.js"
import ErrorHandlerClass from "../../utils/errorHandlerClass.js"
import { CLIENT_ERROR, FORBIDDEN, NOT_FOUND, SERVER_ERROR } from "../../utils/custom-error-codes.js"
import { getJobStatus } from "../../models/jobs/getJobStatus.js"
import { redisQueueLength } from "../../utils/redisUtils.js"
import { outputFolderPath } from "../../models/jobs/updateJobAndSendToQueue.js"
import fs from "fs"
import { logger } from "../../logger/logger.js"
import { getJobById } from "../../models/jobs/getJobById.js"
import { parse } from 'csv-parse';


export const generateInputFile = async (jobId) => {
    const records = [];
    const directoryPath = outputFolderPath(jobId)
    const filePath = `${directoryPath}/input_file.csv`
    const parser = fs.createReadStream(filePath).pipe(parse({ delimiter: ',' }));

    for await (const record of parser) {
        records.push(record);
    }
}

const checkFileExists = (jobId) => {
    const directoryPath = outputFolderPath(jobId)
    const path = `${directoryPath}/input_file.csv`
    fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
            logger.error('File does not exist');
            return false;
        }
    })
    return true
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

    res.setHeader('Content-Type', 'text/csv');
    // Set Content-Disposition header to indicate attachment and file name
    res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
    const csvData = generateInputFile(store.jobId)
    res.send(csvData);
    return
}