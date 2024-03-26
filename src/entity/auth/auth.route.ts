import express from "express";
import bcrypt from "bcrypt";
import { authController } from "./auth.controller.js";
import { db } from "../../database/index.js";
import { users } from "./auth.migration.js";
import jwt from "jsonwebtoken";
import { HttpStatusCode } from "util/http-status-code.js";

const authRouter = express.Router();

authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);

export { authRouter };
