import { logger } from "../../logger/logger.js"
import responseHandler from "../../middlewares/responseHandler.js"
import { createTabs } from "../../models/createTabs.js"
import { SERVER_ERROR } from "../../utils/custom-error-codes.js"
import ErrorHandlerClass from "../../utils/errorHandlerClass.js"



export const createTabsHandler = async (req, res, next) => {
    const store = {
        name: req.body.name,
        account_id: req.body.account_id,
        slug: req.body.slug,
        product_id: req.body.product_id
    }
    const tabsDetails = {
        name: store.name,
        account_id: store.account_id,
        slug: store.slug,
        product_id: store.product_id
    }
    const response = await createTabs(tabsDetails)
    if (response.err) {
        return next(
            new ErrorHandlerClass(SERVER_ERROR.statusCode, SERVER_ERROR.message, response.err)
        )
    }
    req.data = response.data
    responseHandler(req, res, next)
}