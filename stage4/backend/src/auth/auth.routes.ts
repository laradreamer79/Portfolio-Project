import { Router } from "express";
import { login, me, register } from "./auth.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

authRouter.get("/me", authenticate, me);

authRouter.get(
  "/admin",
  authenticate,
  authorize("admin"),
  (_req, res) => {
    res.json({
      message: "Welcome admin",
    });
  },
);
