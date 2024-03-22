import express from "express";
import { productRouter, transactionRouter } from "../entity/index.js";
const v1Router = express.Router();
v1Router.use("/products", productRouter);
v1Router.use("/transactions", transactionRouter);
export { v1Router };
//# sourceMappingURL=v1.js.map