import express from "express";
import { productController } from "./product.controller.js";
const productRouter = express.Router();
productRouter
    .route("/")
    .get(productController.getAll)
    .post(productController.create);
productRouter
    .route("/:id")
    .put(productController.update)
    .delete(productController.delete);
export { productRouter };
//# sourceMappingURL=product.route.js.map