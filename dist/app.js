import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { productListenerHandler } from "./entity/index.js";
import "dotenv/config";
const { BACKEND_URL, FRONTEND_URL, PORT } = process.env;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: [FRONTEND_URL],
        credentials: true,
    },
});
io.on("connection", async (socket) => {
    console.log("a user connected");
    productListenerHandler(io, socket);
    socket.on("disconnect", () => {
        console.log("user disconnect");
    });
});
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${BACKEND_URL}:${PORT}`);
});
//# sourceMappingURL=app.js.map