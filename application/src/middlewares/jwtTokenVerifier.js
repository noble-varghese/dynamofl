import jwt, { VerifyErrors } from "jsonwebtoken"

export const jwtVerifierMiddleware = (secret) => {
    const middleware = (req, res, next) => {
        const authHeader = req.headers.authorization || req.headers.authorization
        if (!authHeader) {
            return res.sendStatus(401)
        }

        var token;
        // A token comes in one of two forms: 'token' or 'Bearer token'
        const authHeaderParts = authenticationHeader.split(' ');
        if (authHeaderParts.length > 2) {
            return res.sendStatus(401)
        }

        if (authHeaderParts.length === 2) {
            [, token] = authHeaderParts;
        } else {
            token = authenticationHeader;
        }

        jwt.verify(token, secret, (err, jwtContent) => {
            if (err) {
                return res.sendStatus(401)
            }
            req.user = jwtContent.data
            next()
        })
    }
    return middleware
}