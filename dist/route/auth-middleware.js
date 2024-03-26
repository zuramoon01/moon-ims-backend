import jwt from "jsonwebtoken";
import "dotenv/config";
import { db } from "../database/index.js";
import { users } from "../entity/index.js";
import { eq } from "drizzle-orm";
import { HttpStatusCode } from "../util/index.js";
const { JWT_KEY } = process.env;
export const authMiddleware = async (req, res, next) => {
    try {
        const authorizationSplit = req.headers.authorization?.split(" ");
        const token = authorizationSplit?.[1];
        if (!token) {
            throw new Error();
        }
        const decoded = jwt.verify(token, JWT_KEY);
        if (typeof decoded === "string" || !decoded.user) {
            throw new Error();
        }
        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, decoded.user.id));
        if (user.length === 0 || !user[0]) {
            throw new Error();
        }
        next();
    }
    catch (err) {
        res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
    }
};
//# sourceMappingURL=auth-middleware.js.map