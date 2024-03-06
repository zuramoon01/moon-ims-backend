import express from "express";
import cors from "cors";
import "dotenv/config";
import { apiRouter } from "./api";

const app = express();
const { URL, PORT } = process.env;

app.use(cors({ credentials: true }));
app.use(express.json());

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${URL}:${PORT}`);
});
