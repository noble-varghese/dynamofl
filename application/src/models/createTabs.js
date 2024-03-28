import { Tab } from "../schemas/tab.js";
import { currentTime } from "..//utils/utilityFunctions.js"
import { logger } from "../logger/logger.js";
import { v4 as uuidv4 } from 'uuid';

export const createTabs = async (tabsDetails) => {
    const res = {}
    try {
        const account = await Tab.create({
            id: uuidv4(),
            created_at: currentTime(),
            updated_at: currentTime(),
            ...tabsDetails
        });
        res.data = account
    } catch (err) {
        logger.error("Error creating tab.", err)
        res.err = err
    }
    return res
}