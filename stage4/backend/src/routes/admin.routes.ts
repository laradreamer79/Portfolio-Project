import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

export const adminRouter = Router();

adminRouter.get(
  "/",
  authenticate,
  authorize("admin"),
  (_request, response) => {
    response.json({
      message: "Welcome admin",
    });
  },
);
