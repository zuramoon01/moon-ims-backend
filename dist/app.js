"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const api_1 = require("./api");
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use((0, cors_1.default)({ credentials: true }));
app.use(express_1.default.json());
app.use("/api", api_1.apiRouter);
app.listen(PORT, () => {
    console.log(`Server running on port http://127.0.0.1:${PORT}`);
});