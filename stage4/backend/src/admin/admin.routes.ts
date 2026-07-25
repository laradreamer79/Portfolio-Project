import { Router } from "express";
import { authorize } from "../middleware/role.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { adminController } from "./admin.controller.js";

export const adminRouter = Router();

adminRouter.use(authenticate, authorize("admin"));

adminRouter.get("/dashboard", adminController.getDashboard);
adminRouter.get("/profile", adminController.getProfile);
adminRouter.patch("/profile", adminController.updateProfile);
