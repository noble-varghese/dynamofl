// import { mongoDbClient } from "../../data-loaders/index.js";
import { logger } from "../logger/logger.js";
import { v4 as uuidv4 } from 'uuid';
import { Account } from "../schemas/account.js";


export const createAccount = async (accountDetails) => {
    const res = {}
    try {
        const account = await Account.create({
            id: uuidv4(),
            ...accountDetails
        });
        res.data = account
    } catch (err) {
        logger.error("Error creating account.", err)
        res.err = err
    }
    return res
}