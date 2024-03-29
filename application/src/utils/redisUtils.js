import { redisClient } from "../data-loaders/index.js"
import { logger } from "../logger/logger.js"


export const redisRPush = async (key, data) => {
    logger.info("redis rpush on packet")
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

export const redisQueueLength = async (key) => {
    logger.debug("getting queue length")
    const res = {}
    try {
        const data = await redisClient.lLen(key)
        res.data = data
    } catch (err) {
        res.err = err
        logger.error("redis queueLength failed: ", err)
        throw Error(err)
    }
    return res
}