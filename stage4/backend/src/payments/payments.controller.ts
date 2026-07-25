import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { HttpError } from "../utils/http-error.js";
import { paymentsService } from "./payments.service.js";
import {
  createPaymentSchema,
  moyasarWebhookSchema,
  paymentIdParamsSchema,
} from "./payments.validation.js";

export const paymentsController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const data = createPaymentSchema.parse(req.body);
      const result = await paymentsService.create({
        ...data,
        userId: req.user.id,
      });

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const { id } = paymentIdParamsSchema.parse(req.params);
      const payment = await paymentsService.getById(id, req.user.id);

      return res.status(200).json(payment);
    } catch (error) {
      next(error);
    }
  },

  async getAll(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payments = await paymentsService.getAll();
      return res.status(200).json(payments);
    } catch (error) {
      next(error);
    }
  },

  async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = moyasarWebhookSchema.parse(req.body);
      const payment = await paymentsService.handleWebhook(payload);

      return res.status(200).json({
        received: true,
        payment,
      });
    } catch (error) {
      next(error);
    }
  },
};
