"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiV1Router = void 0;
const express_1 = __importDefault(require("express"));
const product_1 = require("./product");
const apiV1Router = express_1.default.Router();
exports.apiV1Router = apiV1Router;
apiV1Router.use("/products", product_1.productRouter);
