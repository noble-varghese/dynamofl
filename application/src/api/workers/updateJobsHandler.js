import { validationResult } from "express-validator"
import responseHandler from "../../middlewares/responseHandler.js"
import ErrorHandlerClass from "../../utils/errorHandlerClass.js"
import { CLIENT_ERROR, FORBIDDEN, SERVER_ERROR } from "../../utils/custom-error-codes.js"
import { updateJob } from "../../../models/jobs/updateJob.js"
import { getJobById } from "../../../models/jobs/getJobById.js"


export const updateJobsHandler = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // Return 400 status code with validation errors
        return next(
            new ErrorHandlerClass(CLIENT_ERROR.statusCode, CLIENT_ERROR.message, { errors: errors.array() })
        )
    }
    const store = {
        numFiles: req.body.num_files,
        numRandomValues: req.body.num_random_values,
        jobId: req.params.job_id
    }

    const result1 = getJobById(store.jobId)
    if (result1.err) {
        return next(
            new ErrorHandlerClass(SERVER_ERROR.statusCode, SERVER_ERROR.message, result1.err)
        )
    }
    console.log(result1.data)
    if (result1.data == undefined || result1.data.length == 0) {
        return next(
            new ErrorHandlerClass(FORBIDDEN.statusCode, FORBIDDEN.message, "job doesn't exist")
        )
    }


    const result2 = await updateJob(store.jobId, {
        num_files: store.numFiles,
        num_random_values: store.numRandomValues
    })
    if (result2.err) {
        return next(
            new ErrorHandlerClass(SERVER_ERROR.statusCode, SERVER_ERROR.message, result2.err)
        )
    }

    const result3 = getJobById(store.jobId)
    if (result3.err) {
        return next(
            new ErrorHandlerClass(SERVER_ERROR.statusCode, SERVER_ERROR.message, result3.err)
        )
    }

    req.data = result3
    responseHandler(req, res, next)
}