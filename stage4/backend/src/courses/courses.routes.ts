import { Router } from "express";
import { coursesController } from "./courses.controller.js";
import {
  authenticate,
  optionalAuthenticate,
} from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { requireApprovedInstructor } from "../middleware/instructor-approval.middleware.js";

export const coursesRouter = Router();

coursesRouter.get("/", optionalAuthenticate, coursesController.getAll);
coursesRouter.get("/:id", optionalAuthenticate, coursesController.getById);

coursesRouter.post(
  "/",
  authenticate,
  authorize("diving_center", "instructor", "admin"),
  requireApprovedInstructor,
  upload.single("image"),
  coursesController.create
);

coursesRouter.put(
  "/:id",
  authenticate,
  authorize("diving_center", "instructor", "admin"),
  requireApprovedInstructor,
  upload.single("image"),
  coursesController.update
);

coursesRouter.delete(
  "/:id",
  authenticate,
  authorize("diving_center", "instructor", "admin"),
  requireApprovedInstructor,
  coursesController.delete
);
