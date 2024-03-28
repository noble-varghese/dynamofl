import { User } from "../schemas/users.js";
import { currentTime } from "..//utils/utilityFunctions.js"
import { logger } from "../logger/logger.js";
import { v4 as uuidv4 } from 'uuid';

export const createUser = async (userDetails) => {
    const res = {}
    try {
        const account = await User.create({
            id: uuidv4(),
            created_at: currentTime(),
            updated_at: currentTime(),
            ...userDetails
        });
        res.data = account
    } catch (err) {
        logger.error("Error creating account.", err)
        res.err = err
    }
    return res
}