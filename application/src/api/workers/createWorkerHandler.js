import { validationResult } from "express-validator"
import responseHandler from "../../middlewares/responseHandler.js"
import ErrorHandlerClass from "../../utils/errorHandlerClass.js"
import { CLIENT_ERROR, SERVER_ERROR } from "../../utils/custom-error-codes.js"
import { DEFAULT_JOB_ID, ORCHESTRRATOR_QUEUE } from "../../utils/constants.js"
import { pgClient, redisClient } from "../../data-loaders/index.js"
import { WORKERS_TABLE } from "../../../models/tables.js"
import { redisRPush } from "../../utils/redisUtils.js"
import { logger } from "../../logger/logger.js"
import { randomUUID } from "crypto";



const createAndSendToOrchestrator = async (num) => {
    const res = {}
    // Begin a transaction
    const trx = await pgClient.transaction()
    try {
        // construct the jobs for pg
        const data = []
        for (let i = 0; i < num; i++) {
            const id = randomUUID()
            data.push({
                job_id: DEFAULT_JOB_ID,
                id
            })
        }


        // Create Jobs and add to postgres
        await trx(WORKERS_TABLE).insert(data)
        logger.info("creating data")

        // Send the jobs to orchestrator queue
        for (const i of data) {
            logger.info(i)
            await redisRPush(ORCHESTRRATOR_QUEUE, JSON.stringify(i))
        }

        await trx.commit()
    } catch (err) {
        await trx.rollback()
        logger.error("Rollback in progress.", err)
        res.err = err
    }
    return res
}


export const createWorkerHandler = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // Return 400 status code with validation errors
        return next(
            new ErrorHandlerClass(CLIENT_ERROR.statusCode, CLIENT_ERROR.message, { errors: errors.array() })
        )
    }
    const store = {
        count: req.body.count,
    }
    const result = await createAndSendToOrchestrator(store.count)
    if (result.err) {
        return next(
            new ErrorHandlerClass(SERVER_ERROR.statusCode, SERVER_ERROR.message, result.err)
        )
    }

    req.data = "Initiating Worker Creation Process!"
    responseHandler(req, res, next)
}