import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { instructorsController } from "./instructors.controller.js";

export const instructorsRouter = Router();

instructorsRouter.use(authenticate, authorize("instructor"));
instructorsRouter.get("/me", instructorsController.getMine);
instructorsRouter.patch("/me", instructorsController.updateMine);
