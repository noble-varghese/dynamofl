import { validationResult } from "express-validator"
import responseHandler from "../../middlewares/responseHandler.js"
import ErrorHandlerClass from "../../utils/errorHandlerClass.js"
import { CLIENT_ERROR, FORBIDDEN, SERVER_ERROR } from "../../utils/custom-error-codes.js"
import { updateJobAndSendToQueue } from "../../models/jobs/updateJobAndSendToQueue.js"
import { getJobById } from "../../models/jobs/getJobById.js"
import { logger } from "../../logger/logger.js"
import { getPendingJobById } from "../../models/jobs/getPendingJobById.js"


export const updateJobsHandler = async (req, res, next) => {
    logger.info("Inside update jobs handler...")
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // Return 400 status code with validation errors
        return next(
            new ErrorHandlerClass(CLIENT_ERROR.statusCode, CLIENT_ERROR.message, { errors: errors.array() })
        )
    }
    logger.info(req.params)
    const store = {
        jobId: req.params.tab_id,
        numFiles: req.body.num_files,
        numRandomValues: req.body.num_random_values,
    }

    logger.info(`JobID: ${store.jobId}`)

    const result1 = await getPendingJobById(store.jobId)
    if (result1.err) {
        return next(
            new ErrorHandlerClass(SERVER_ERROR.statusCode, SERVER_ERROR.message, result1.err)
        )
    }
    logger.info(`${result1.data}`)
    if (result1.data == undefined || result1.data.length == 0) {
        return next(
            new ErrorHandlerClass(FORBIDDEN.statusCode, FORBIDDEN.message, "Job doesn't exist or Job has already been created.")
        )
    }

    const queueName = result1.data[0]['queue_name']

    const result2 = await updateJobAndSendToQueue(queueName, store.jobId, {
        files_num: store.numFiles,
        rand_num_count: store.numRandomValues
    })
    if (result2.err) {
        return next(
            new ErrorHandlerClass(SERVER_ERROR.statusCode, SERVER_ERROR.message, result2.err)
        )
    }

    const result3 = await getJobById(store.jobId)
    if (result3.err) {
        return next(
            new ErrorHandlerClass(SERVER_ERROR.statusCode, SERVER_ERROR.message, result3.err)
        )
    }

    req.data = result3
    responseHandler(req, res, next)
}