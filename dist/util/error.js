import { ZodError } from "zod";
export const handleError = (error, message) => {
    console.log(`Error : ${message}`);
    if (error instanceof ZodError) {
        handleZodError(error);
    }
    else {
        console.log(error);
    }
};
const handleZodError = (error) => {
    console.log(error.format());
};
//# sourceMappingURL=error.js.map