import express from "express";
import { transactionController } from "./transaction.controller.js";

const transactionRouter = express.Router();

transactionRouter
  .route("/")
  .get(transactionController.get)
  .delete(transactionController.deleteBulk);
transactionRouter.post("/purchase", transactionController.purchase);
transactionRouter.post("/sale", transactionController.sale);

export { transactionRouter };
