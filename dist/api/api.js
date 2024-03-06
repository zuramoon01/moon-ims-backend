"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = __importDefault(require("express"));
const v1_1 = require("./v1");
const apiRouter = express_1.default.Router();
exports.apiRouter = apiRouter;
apiRouter.use("/v1", v1_1.apiV1Router);
