

class ErrorHandlerClass extends Error {
    constructor(httpStatusCode = 500, message, context, code, ...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);
        this.message = message;
        this.status = httpStatusCode;
        this.context = context;
        this.code = code;
        this.date = new Date();
    }
}

export default ErrorHandlerClass;