import { validationResult } from "express-validator"
import responseHandler from "../../middlewares/responseHandler.js"
import ErrorHandlerClass from "../../utils/errorHandlerClass.js"
import { CLIENT_ERROR, SERVER_ERROR } from "../../utils/custom-error-codes.js"
import { getJobStatus } from "../../../models/jobs/getJobStatus.js"
import { getAllJobs } from "../../../models/jobs/getAllJobs.js"


export const getAllJobStatusHandler = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // Return 400 status code with validation errors
        return next(
            new ErrorHandlerClass(CLIENT_ERROR.statusCode, CLIENT_ERROR.message, { errors: errors.array() })
        )
    }
    const store = {}
    const result = await getAllJobs()
    if (result.err) {
        return next(
            new ErrorHandlerClass(SERVER_ERROR.statusCode, SERVER_ERROR.message, result.err)
        )
    }
    const workerData = result.data.map(obj => {
        return {
            id: obj.worker_id,
            status: obj.worker_status,
            queue_name: obj.worker_queue_name,
            created_at: obj.created_at,
            updated_at: obj.updated_at,

        }
    })
    const jobData = {
        id: result.data[0].id,
        name: result.data[0].name,
        files_num: result.data[0].files_num,
        rand_num_count: result.data[0].rand_num_count,
        worker_count: result.data[0].worker_count,
        status: result.data[0].status,
        created_at: result.data[0].created_at,
        updated_at: result.data[0].updated_at
    }
    req.data = { ...jobData, worker_data: workerData }
    responseHandler(req, res, next)
}