import { validationResult } from "express-validator"
import responseHandler from "../../middlewares/responseHandler.js"
import ErrorHandlerClass from "../../utils/errorHandlerClass.js"
import { CLIENT_ERROR, FORBIDDEN, SERVER_ERROR } from "../../utils/custom-error-codes.js"
import { updateJobAndSendToQueue } from "../../../models/jobs/updateJobAndSendToQueue.js"
import { getJobById } from "../../../models/jobs/getJobById.js"
import { logger } from "../../logger/logger.js"
import { getPendingJobById } from "../../../models/jobs/getPendingJobById.js"
import { updateJobById } from "../../../models/jobs/updateJobById.js"


export const updateJobStatusHandler = async (req, res, next) => {
    // Internal API to be used by the consumers
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
        status: req.body.status
    }

    logger.info(`JobID: ${store.jobId}`)

    const result1 = await getJobById(store.jobId)
    if (result1.err) {
        return next(
            new ErrorHandlerClass(SERVER_ERROR.statusCode, SERVER_ERROR.message, result1.err)
        )
    }
    logger.info(`${result1.data}`)
    if (result1.data == undefined || result1.data.length == 0) {
        return next(
            new ErrorHandlerClass(FORBIDDEN.statusCode, FORBIDDEN.message, "job doesn't exist")
        )
    }
    const result2 = await updateJobById(store.jobId, { status: store.status })
    if (result2.err) {
        return next(
            new ErrorHandlerClass(SERVER_ERROR.statusCode, SERVER_ERROR.message, result1.err)
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