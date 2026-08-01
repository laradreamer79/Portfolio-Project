import { Router } from "express";
import { tripsController } from "./trips.controller.js";
import {
  authenticate,
  optionalAuthenticate,
} from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { requireApprovedInstructor } from "../middleware/instructor-approval.middleware.js";

export const tripsRouter = Router();

tripsRouter.get("/", optionalAuthenticate, tripsController.getAll);
tripsRouter.get("/:id", optionalAuthenticate, tripsController.getById);

tripsRouter.post(
  "/",
  authenticate,
  authorize("diving_center", "instructor", "admin"),
  requireApprovedInstructor,
  upload.single("image"),
  tripsController.create
);

tripsRouter.put(
  "/:id",
  authenticate,
  authorize("diving_center", "instructor", "admin"),
  requireApprovedInstructor,
  upload.single("image"),
  tripsController.update
);

tripsRouter.delete(
  "/:id",
  authenticate,
  authorize("diving_center", "instructor", "admin"),
  requireApprovedInstructor,
  tripsController.delete
);
