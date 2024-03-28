export const SERVER_ERROR = {
    statusCode: 500,
    message: "Internal Server Error.",
};

export const UNAUTHORIZED = {
    statusCode: 401,
    message: "Unauthorised Request",
};

export const FORBIDDEN = {
    statusCode: 403,
    message: "You do not have enough permissions to execute this request",
};

export const CLIENT_ERROR = {
    statusCode: 400,
    message: "Invalid request. Please check and try again.",
};

export const NOT_FOUND = {
    statusCode: 404,
    message: "The specified resource or API endpoint does not exist on the server.",
};

export const API_NOT_FOUND = {
    statusCode: 404,
    message: "API not found. Please check the path.",
}

export const METHOD_NOT_ALLOWED = {
    statusCode: 405,
    message: "Method Not Allowed",
};
