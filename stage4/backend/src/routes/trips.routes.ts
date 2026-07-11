import { Router } from "express";
import { tripsController } from "../controllers/trips.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

export const tripsRouter = Router();

tripsRouter.get("/", tripsController.getAll);
tripsRouter.get("/:id", tripsController.getById);

tripsRouter.post(
  "/",
  authenticate,
  authorize("diving_center", "instructor", "admin"),
  upload.single("image"),
  tripsController.create
);

tripsRouter.put(
  "/:id",
  authenticate,
  authorize("diving_center", "instructor", "admin"),
  upload.single("image"),
  tripsController.update
);

tripsRouter.delete(
  "/:id",
  authenticate,
  authorize("diving_center", "instructor", "admin"),
  tripsController.delete
);
