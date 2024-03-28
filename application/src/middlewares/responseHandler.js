export default (req, res, next) => {
    const successAPIStatusCode = 200;

    const DEFAULT_BODY = {
        success: true,
        data: {},
    };

    if (req.data) DEFAULT_BODY.data = req.data;
    if (req.token) DEFAULT_BODY.token = req.token;

    return res.status(successAPIStatusCode)
        .send(DEFAULT_BODY);
};
