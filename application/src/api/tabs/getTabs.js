import responseHandler from "../../middlewares/responseHandler.js"
import { getTabById } from "../../models/getTabById.js"
import ErrorHandlerClass from "../../utils/errorHandlerClass.js"


export const getTabsHandler = async (req, res, next) => {
    const store = {
        id: req.params.tabId
    }
    const response = await getTabById(store.id)
    if (response.err) {
        return next(
            new ErrorHandlerClass(SERVER_ERROR.statusCode, SERVER_ERROR.message, response.err)
        )
    }
    req.data = response.data[0]
    responseHandler(req, res, next)
}