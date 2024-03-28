import responseHandler from "../../middlewares/responseHandler.js"
import { getProductById } from "../../models/getProductById.js"
import ErrorHandlerClass from "../../utils/errorHandlerClass.js"


export const getProductHandler = async (req, res, next) => {
    const store = {
        id: req.params.productId
    }
    const response = await getProductById(store.id)
    if (response.err) {
        return next(
            new ErrorHandlerClass(SERVER_ERROR.statusCode, SERVER_ERROR.message, response.err)
        )
    }
    req.data = response.data[0]
    responseHandler(req, res, next)
}