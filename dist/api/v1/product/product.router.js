"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = __importDefault(require("express"));
const _1 = require(".");
const productRouter = express_1.default.Router();
exports.productRouter = productRouter;
productRouter
    .route("/")
    .get(_1.productController.get)
    .post(_1.productController.create);
productRouter
    .route("/:id")
    .get(_1.productController.getById)
    .put(_1.productController.update)
    .delete(_1.productController.delete);
