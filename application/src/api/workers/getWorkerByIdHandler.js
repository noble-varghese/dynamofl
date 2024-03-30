import { validationResult } from "express-validator"
import responseHandler from "../../middlewares/responseHandler.js"
import ErrorHandlerClass from "../../utils/errorHandlerClass.js"
import { CLIENT_ERROR, FORBIDDEN, SERVER_ERROR } from "../../utils/custom-error-codes.js"
import { getWorkerById } from "../../models/jobs/getWorkerById.js"
import { logger } from "../../logger/logger.js"


export const getWorkerByIdHandler = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // Return 400 status code with validation errors
        return next(
            new ErrorHandlerClass(CLIENT_ERROR.statusCode, CLIENT_ERROR.message, { errors: errors.array() })
        )
    }
    logger.info(req.params)
    const store = {
        workerId: req.params.worker_id
    }
    const result = await getWorkerById(store.workerId)
    if (result.err) {
        return next(
            new ErrorHandlerClass(SERVER_ERROR.statusCode, SERVER_ERROR.message, result.err)
        )
    }
    if (result.data.length == 0) {
        return next(
            new ErrorHandlerClass(FORBIDDEN.statusCode, FORBIDDEN.message, "worker doesn't exist")
        )
    }
    req.data = result.data
    responseHandler(req, res, next)
}