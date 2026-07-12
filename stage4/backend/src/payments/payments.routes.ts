import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import {
  ROLES,
  authorizeRoles,
} from "../common/decorators/roles.js";

import {
  createPaymentController,
  getPaymentController,
  getAllPaymentsController,
  webhookController,
} from "./payments.controller.js";

export const paymentsRouter = Router();

/**
 * Create a payment for the authenticated user's booking.
 *
 * POST /api/payments
 */
paymentsRouter.post(
  "/",
  authenticate,
  createPaymentController,
);

/**
 * Moyasar webhook endpoint.
 *
 * This route must not use JWT authentication because Moyasar,
 * not a logged-in Oyster user, sends this request.
 *
 * POST /api/payments/webhook
 */
paymentsRouter.post(
  "/webhook",
  webhookController,
);

/**
 * Get one payment owned by the authenticated user.
 *
 * GET /api/payments/:id
 */
paymentsRouter.get(
  "/:id",
  authenticate,
  getPaymentController,
);

/**
 * List all payments.
 *
 * Admin only.
 *
 * GET /api/payments
 */
paymentsRouter.get(
  "/",
  authenticate,
  authorizeRoles(ROLES.ADMIN),
  getAllPaymentsController,
);
