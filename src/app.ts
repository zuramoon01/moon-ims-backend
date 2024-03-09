import express from "express";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import { productListenerHandler, ProductsWithConfig } from "./entity/index.js";
import "dotenv/config";

const { BACKEND_URL, FRONTEND_URL, PORT } = process.env as {
  BACKEND_URL: string;
  FRONTEND_URL: string;
  PORT: string;
};

const app = express();
const httpServer = createServer(app);

export interface ClientToServerEvents {
  "product:getAll": (
    arg: any,
    callback: (response: {
      data?: ProductsWithConfig;
      message?: string;
    }) => void,
  ) => void;
  "product:add": (
    arg: any,
    callback: (response: { success: boolean; message: string }) => void,
  ) => Promise<void>;
  "product:update": (
    arg1: any,
    arg2: any,
    callback: (response: { success: boolean; message: string }) => void,
  ) => Promise<void>;
  "product:delete": (
    arg: any,
    callback: (response: { success: boolean; message: string }) => void,
  ) => Promise<void>;
}

export interface ServerToClientEvents {
  "product:getAll": () => void;
}

export interface InterServerEvents {}

export interface SocketData {}

export type IOType = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type SocketType = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

const io: IOType = new Server(httpServer, {
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
