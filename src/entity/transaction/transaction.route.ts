import express from "express";
import { transactionController } from "./transaction.controller.js";

const transactionRouter = express.Router();

transactionRouter.get("/", transactionController.get);
transactionRouter.post("/purchase", transactionController.purchase);
transactionRouter.post("/sale", transactionController.sale);

export { transactionRouter };
