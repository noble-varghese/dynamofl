import responseHandler from "../../middlewares/responseHandler.js"
import { getUser } from "../../models/getUser.js"
import ErrorHandlerClass from "../../utils/errorHandlerClass.js"


export const getUserHandler = async (req, res, next) => {
    const store = {
        id: req.params.userId
    }
    const response = await getUser(store.id)
    if (response.err) {
        return next(
            new ErrorHandlerClass(SERVER_ERROR.statusCode, SERVER_ERROR.message, response.err)
        )
    }
    req.data = response.data[0]
    responseHandler(req, res, next)
}