import express from "express";
import { productRouter } from "../entity/product/index.js";

const apiV1Router = express.Router();

apiV1Router.use("/products", productRouter);

export { apiV1Router };
