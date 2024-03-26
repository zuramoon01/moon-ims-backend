import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { apiRouter } from "./route/index.js";
import "dotenv/config";

const { BACKEND_URL, FRONTEND_URL, PORT } = process.env as {
  BACKEND_URL: string;
  FRONTEND_URL: string;
  PORT: string;
};

const app = express();

app.use(
  cors({
    origin: [FRONTEND_URL],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${BACKEND_URL}:${PORT}`);
});
