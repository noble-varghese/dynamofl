import { validationResult } from "express-validator"
import responseHandler from "../../middlewares/responseHandler.js"
import ErrorHandlerClass from "../../utils/errorHandlerClass.js"
import { CLIENT_ERROR, SERVER_ERROR } from "../../utils/custom-error-codes.js"
import { DEFAULT_JOB_ID, ORCHESTRRATOR_QUEUE, WORKER_CREATION_MESSAGE } from "../../utils/constants.js"
import { pgClient, redisClient } from "../../data-loaders/index.js"
import { JOBS_TABLE, WORKERS_TABLE } from "../../../models/tables.js"
import { redisRPush } from "../../utils/redisUtils.js"
import { logger } from "../../logger/logger.js"
import { randomUUID } from "crypto";


const createAndSendToOrchestrator = async (num) => {
    logger.debug("starting createAndSendToOrchestrator..")
    const res = {}
    // Begin a transaction
    const trx = await pgClient.transaction()
    try {
        // construct the jobs for pg

        const job_id = randomUUID()
        const worker_id = randomUUID()
        await pgClient(JOBS_TABLE).insert({
            name: randomUUID(),
            id: job_id
        })
        const data = []
        for (let i = 0; i < num; i++) {
            data.push({
                job_id: job_id,
                id: worker_id
            })
        }


        // Create Jobs and add to postgres
        await trx(WORKERS_TABLE).insert(data)

        // Send the jobs to orchestrator queue
        for (const i of data) {
            await redisRPush(ORCHESTRRATOR_QUEUE, JSON.stringify({
                message: WORKER_CREATION_MESSAGE,
                job_id,
                worker_id

            }))
        }

        req.data = {
            job_id, worker_id
        }

        await trx.commit()
    } catch (err) {
        await trx.rollback()
        logger.error("Rollback in progress.", err)
        res.err = err
    }
    logger.debug("success on createAndSendToOrchestrator")
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

    req.data = {
        messsage: "Initiating Worker Creation Process!",
        ...res.data
    }
    responseHandler(req, res, next)
}