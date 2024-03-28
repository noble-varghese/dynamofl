import responseHandler from "../../middlewares/responseHandler.js";
import { createUser } from "../../models/createUser.js";
import { SERVER_ERROR } from "../../utils/custom-error-codes.js";
import ErrorHandlerClass from "../../utils/errorHandlerClass.js";


export const createUserHandler = async (req, res, next) => {
    const store = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        user_name: req.body.user_name,
        email: req.body.email,
        account_id: req.body.account_id
    }

    const userDetails = {
        first_name: store.first_name,
        last_name: store.last_name,
        user_name: store.user_name,
        email: store.email,
        account_id: store.account_id
    }

    const response = await createUser(userDetails)
    if (response.err) {
        return next(
            new ErrorHandlerClass(SERVER_ERROR.statusCode, SERVER_ERROR.message, response.err)
        )
    }
    req.data = response.data

    responseHandler(req, res, next)
}