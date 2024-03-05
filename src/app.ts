import "dotenv/config";
import express from "express";
import cors from "cors";
import { apiRouter } from "./api";

const app = express();
const PORT = process.env.PORT;

app.use(cors({ credentials: true }));
app.use(express.json());

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on port http://127.0.0.1:${PORT}`);
});
