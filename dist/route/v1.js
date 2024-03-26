import express from "express";
import { authRouter, productRouter, transactionRouter, } from "../entity/index.js";
import { authMiddleware } from "./auth-middleware.js";
const v1Router = express.Router();
v1Router.use("/auth", authRouter);
v1Router.use("/products", authMiddleware, productRouter);
v1Router.use("/transactions", authMiddleware, transactionRouter);
export { v1Router };
//# sourceMappingURL=v1.js.map