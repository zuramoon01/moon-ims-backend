"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const zod_1 = require("zod");
const handleError = (error, message) => {
    console.error(`Error : ${message}`);
    if (error instanceof zod_1.ZodError) {
        handleZodError(error);
    }
    else {
        console.error(error);
    }
};
exports.handleError = handleError;
const handleZodError = (error) => {
    console.error(error.format());
};
