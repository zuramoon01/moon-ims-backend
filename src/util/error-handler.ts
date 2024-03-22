import { ZodError } from "zod";

export const handleError = (error: unknown, message: string) => {
  console.log(`Error : ${message}`);

  if (error instanceof ZodError) {
    handleZodError(error);
  } else {
    console.log(error);
  }
};

const handleZodError = (error: ZodError) => {
  console.log(error.format());
};
