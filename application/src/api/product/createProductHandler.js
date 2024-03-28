import responseHandler from "../../middlewares/responseHandler.js"
import idGenerator from "../../utils/idGenerator.js";
import { Product } from "../../schemas/product.js"

export const createProductHandler = async (req, res, next) => {
    const { name, slug: prod_slug } = req.body;
    const store = {
        name: req.body.name,
        slug: req.body.slug,
        account_id: req.body.account_id,
        owner: req.body.owner
    }
    const prodId = idGenerator("prod");

    const product = await Product.create({
        account_id: new mongoose.Types.ObjectId("656f2e0056a2b5decf081f16"),
        id: prodId,
        name: name,
        prod_slug: prod_slug,
    });
    req.data = product
    responseHandler(req, res, next)
}