import express from "express";
import { productRouter } from "../entity/product/index.js";

const v1Router = express.Router();

v1Router.use("/products", productRouter);

export { v1Router };
