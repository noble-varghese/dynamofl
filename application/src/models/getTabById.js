
import { logger } from "../logger/logger.js";
import { Tab } from "../schemas/tab.js";

export const getTabById = async (id) => {
    const res = {}
    try {
        const account = await Tab.find({
            id
        });
        res.data = account
    } catch (err) {
        logger.error(`Error getting user ${id} : `, err)
        res.err = err
    }
    return res
}