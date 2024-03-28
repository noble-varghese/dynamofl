

import ErrorHandlerClass from "../utils/errorHandlerClass.js";
import { SERVER_ERROR } from "../utils/custom-error-codes.js";

const errorHandler = (err, req, res, next) => {
    const defaultErrorAPIStatusCode = 500;
    if (err instanceof ErrorHandlerClass) {
        res.setHeader("content-type", "application/json");
        res.status(err.status)
            .send({
                success: false,
                data: {
                    message: err.message,
                    context: err.context,
                },
            });
    } else {
        res.status(defaultErrorAPIStatusCode)
            .send(SERVER_ERROR);
    }
};

export default errorHandler;