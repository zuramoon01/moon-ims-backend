import { HttpStatusCode, handleError } from "../../util/index.js";
import bcrypt from "bcrypt";
import { z } from "zod";
import { db } from "../../database/index.js";
import { users } from "./auth.migration.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import "dotenv/config";
const { JWT_KEY } = process.env;
export const authController = {
    login: async (req, res) => {
        try {
            const bodySchema = z.object({
                name: z.string().max(32),
                password: z.string().max(256),
            });
            const { name, password } = bodySchema.parse(req.body);
            const user = await db.select().from(users).where(eq(users.name, name));
            if (user.length === 0 || !user[0]) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({
                    message: "Nama atau kata sandi yang Anda masukkan salah.",
                });
            }
            const isMatch = await bcrypt.compare(password, user[0].password);
            if (!isMatch) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({
                    message: "Nama atau kata sandi yang Anda masukkan salah.",
                });
            }
            const token = jwt.sign({ user: { id: user[0].id, name: user[0].name } }, JWT_KEY, {
                expiresIn: "1d",
            });
            return res.status(HttpStatusCode.OK).json({
                message: "Berhasil masuk.",
                token,
            });
        }
        catch (error) {
            handleError(error, "authController.login");
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                message: "Invalid Data.",
            });
        }
    },
    logout: async (req, res) => {
        try {
            return res.status(HttpStatusCode.OK).json({
                message: "Berhasil keluar.",
            });
        }
        catch (error) {
            handleError(error, "authController.logout");
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                message: "Invalid Data.",
            });
        }
    },
};
//# sourceMappingURL=auth.controller.js.map