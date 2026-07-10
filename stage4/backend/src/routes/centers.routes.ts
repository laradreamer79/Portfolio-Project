import { Router } from "express";
import { centersController } from "../controllers/centers.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

export const centersRouter = Router();

centersRouter.get("/", centersController.getAll);
centersRouter.get("/:id", centersController.getById);
centersRouter.post("/", authenticate, authorize("diving_center", "admin"), upload.single("image"), centersController.create);
centersRouter.put("/:id", authenticate, authorize("diving_center", "admin"), upload.single("image"), centersController.update);
centersRouter.delete("/:id", authenticate, authorize("admin"), centersController.delete);