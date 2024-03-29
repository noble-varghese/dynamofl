import express from "express"
import ErrorHandlerClass from "../utils/errorHandlerClass.js";
import { NOT_FOUND } from "../utils/custom-error-codes.js";
import responseHandler from "../middlewares/responseHandler.js";
import { createWorkerHandler } from "../api/workers/createWorkerHandler.js";
import { updateJobsHandler } from "../api/workers/updateJobsHandler.js";
import { body, param } from "express-validator";
import { getJobStatusHandler } from "../api/workers/getJobStatusHandler.js";
import { getAllJobStatusHandler } from "../api/workers/getAllJobStatusHandler.js";
import { updateWorkerStatusHandler } from "../api/workers/updateWorkerStatusHandler.js";
import { getWorkerByIdHandler } from "../api/workers/getWorkerByIdHandler.js";

export const defineRoutes = (app) => {
    const router = express.Router();
    router.get("/ping", async (req, res, next) => {
        req.data = "pong!"
        responseHandler(req, res, next)
    });

    router.post(
        "/worker",
        [
            body('count')
                .notEmpty().withMessage('count is required.')
                .isInt().withMessage('count must be an integer.')
        ],
        createWorkerHandler
    );

    router.get(
        "/job/:job_id",
        [
            param('job_id')
                .notEmpty()
                .trim()
                .isUUID(),
        ],
        getJobStatusHandler
    );

    router.get(
        "/job",
        [
        ],
        getAllJobStatusHandler
    );

    router.put(
        "/job/:jobs_id",
        [
            param('jobs_id').notEmpty().isUUID(),
            body('num_files')
                .notEmpty().withMessage('num_files is required.')
                .isInt().withMessage('num_files must be an integer.'),
            body('num_random_values')
                .notEmpty().withMessage('num_random_values is required.')
                .isInt().withMessage('num_random_values must be an integer.')
        ],
        updateJobsHandler
    );

    router.put(
        "/worker/:worker_id",
        [
            param('worker_id').notEmpty().isUUID(),
            body('status').notEmpty().isIn(['PENDING', 'WAITING_FOR_PACKETS', 'RUNNING', 'COMPLETED', 'FAILED']).withMessage('Invalid value for "status"')
        ],
        updateWorkerStatusHandler
    )

    router.get(
        "/worker/:worker_id",
        [
            param('worker_id').notEmpty().isUUID(),
        ],
        getWorkerByIdHandler
    )


    app.use('/v1', router)

    // handling the 404 errors
    app.use("/*", (req, res, next) => {
        next(new ErrorHandlerClass(NOT_FOUND.statusCode, NOT_FOUND.message));
    });
}