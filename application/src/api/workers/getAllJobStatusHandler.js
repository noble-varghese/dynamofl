import { validationResult } from "express-validator"
import responseHandler from "../../middlewares/responseHandler.js"
import ErrorHandlerClass from "../../utils/errorHandlerClass.js"
import { CLIENT_ERROR, SERVER_ERROR } from "../../utils/custom-error-codes.js"
import { getJobStatus } from "../../models/jobs/getJobStatus.js"
import { getAllJobs } from "../../models/jobs/getAllJobs.js"
import { redisQueueLength } from "../../utils/redisUtils.js"


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
    const data = {}
    for (const obj of result.data) {
        if (data[obj.id] == undefined) {
            data[obj.id] = {
                id: obj.id,
                name: obj.name,
                files_num: obj.files_num,
                rand_num_count: obj.rand_num_count,
                worker_count: obj.worker_count,
                queue_name: obj.worker_queue_name,
                curr_queue_length: await redisQueueLength(obj.worker_queue_name),
                status: obj.status,
                created_at: obj.created_at,
                updated_at: obj.updated_at,
                worker_data: []
            }
        }
        data[obj.id].worker_data.push({
            id: obj.worker_id,
            status: obj.worker_status,
            created_at: obj.created_at,
            updated_at: obj.updated_at,
        })
    }
    req.data = Object.values(data)
    responseHandler(req, res, next)
}