import express from "express";
import cors from "cors";
import { apiRouter } from "./route/index.js";
import "dotenv/config";
const { BACKEND_URL, FRONTEND_URL, PORT } = process.env;
const app = express();
app.use(cors({
    origin: [FRONTEND_URL],
    credentials: true,
}));
app.use(express.json());
app.use("/api", apiRouter);
app.listen(PORT, () => {
    console.log(`Server running on port ${BACKEND_URL}:${PORT}`);
});
//# sourceMappingURL=app.js.map