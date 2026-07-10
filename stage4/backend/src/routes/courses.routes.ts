import { Router } from "express";
import { coursesController } from "../controllers/courses.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

export const coursesRouter = Router();

coursesRouter.get("/", coursesController.getAll);
coursesRouter.get("/:id", coursesController.getById);

coursesRouter.post(
  "/",
  authenticate,
  authorize("diving_center", "instructor", "admin"),
  upload.single("image"),
  coursesController.create
);

coursesRouter.put(
  "/:id",
  authenticate,
  authorize("diving_center", "instructor", "admin"),
  upload.single("image"),
  coursesController.update
);

coursesRouter.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  coursesController.delete
);