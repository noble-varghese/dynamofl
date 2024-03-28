
import { logger } from "../logger/logger.js";
import { Product } from "../schemas/product.js";

export const getProductById = async (id) => {
    const res = {}
    try {
        const account = await Product.find({
            id
        });
        res.data = account
    } catch (err) {
        logger.error(`Error getting user ${id} : `, err)
        res.err = err
    }
    return res
}