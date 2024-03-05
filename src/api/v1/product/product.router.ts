import express from "express";
import { productController } from ".";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(productController.get)
  .post(productController.create);

productRouter
  .route("/:id")
  .get(productController.getById)
  .put(productController.update)
  .delete(productController.delete);

export { productRouter };
