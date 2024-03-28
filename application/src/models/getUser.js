
import { User } from "../schemas/users.js";
import { logger } from "../logger/logger.js";

export const getUser = async (id) => {
    const res = {}
    try {
        const account = await User.find({
            id
        });
        res.data = account
    } catch (err) {
        logger.error(`Error getting user ${id} : `, err)
        res.err = err
    }
    return res
}