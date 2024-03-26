import express from "express";
import { authController } from "./auth.controller.js";
const authRouter = express.Router();
// authRouter.post("/register", async (req, res) => {
//   const name = "tokodyt";
//   const password = await bcrypt.hash("mtikyu01", 10);
//   await db.insert(users).values({
//     name,
//     password,
//   });
//   res.end("ok");
// });
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
export { authRouter };
//# sourceMappingURL=auth.route.js.map