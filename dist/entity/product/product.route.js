import express from "express";
import { productController } from "./product.controller.js";
const productRouter = express.Router();
productRouter
    .route("/")
    .get(productController.get)
    .post(productController.create)
    .delete(productController.deleteBulk);
productRouter.put("/:id", productController.update);
export { productRouter };
//# sourceMappingURL=product.route.js.map