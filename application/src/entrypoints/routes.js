import express from "express"
import ErrorHandlerClass from "../utils/errorHandlerClass.js";
import { NOT_FOUND } from "../utils/custom-error-codes.js";
import responseHandler from "../middlewares/responseHandler.js";
import { createWorkerHandler } from "../api/workers/createWorkerHandler.js";
import { createJobsHandler } from "../api/workers/createJobsHandler.js";
import { body, param } from "express-validator";
import { getJobStatusHandler } from "../api/workers/getJobStatusHandler.js";

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
        createWorkerHandler)
    router.post(
        "/job",
        [
            body('num_files')
                .notEmpty().withMessage('num_files is required.')
                .isInt().withMessage('num_files must be an integer.'),
            body('num_random_values')
                .notEmpty().withMessage('num_random_values is required.')
                .isInt().withMessage('num_random_values must be an integer.')
        ],
        createJobsHandler
    )
    router.get("/job/:jobId", param('jobId').notEmpty(), getJobStatusHandler)





    app.use('/v1', router)

    // handling the 404 errors
    app.use("/*", (req, res, next) => {
        next(new ErrorHandlerClass(NOT_FOUND.statusCode, NOT_FOUND.message));
    });
}