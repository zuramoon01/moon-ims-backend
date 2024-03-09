import { ZodError } from "zod";
export const handleError = (error, message) => {
    console.error(`Error : ${message}`);
    if (error instanceof ZodError) {
        handleZodError(error);
    }
    else {
        console.error(error);
    }
};
const handleZodError = (error) => {
    console.error(error.format());
};
//# sourceMappingURL=error.js.map