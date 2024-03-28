import { redisClient } from "../data-loaders/index.js"
import { logger } from "../logger/logger.js"


export const redisRPush = async (key, data) => {
    const res = {}
    try {
        await redisClient.rPush(key, data)
    } catch (err) {
        res.err = err
        logger.error("redis insertion failed: ", err)
        throw Error(err)
    }
    return res
}