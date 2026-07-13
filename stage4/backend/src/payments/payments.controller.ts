import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type {
  AuthRequest,
} from "../middleware/auth.middleware.js";

import {
  createPayment,
  getAllPayments,
  getPayment,
  handleWebhook,
} from "./payments.service.js";

export async function createPaymentController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const {
      bookingId,
      paymentMethod,
      sourceToken,
    } = req.body;

    if (
      !Number.isInteger(bookingId) ||
      bookingId < 1
    ) {
      return res.status(400).json({
        message:
          "bookingId must be a positive integer",
      });
    }

    if (
      typeof paymentMethod !== "string" ||
      paymentMethod.trim().length === 0
    ) {
      return res.status(400).json({
        message: "paymentMethod is required",
      });
    }

    const result = await createPayment({
      bookingId,
      userId: req.user.id,
      paymentMethod: paymentMethod.trim(),
      sourceToken:
        typeof sourceToken === "string"
          ? sourceToken.trim()
          : undefined,
    });

    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "BOOKING_NOT_FOUND":
          return res.status(404).json({
            message: "Booking not found",
          });

        case "FORBIDDEN":
          return res.status(403).json({
            message:
              "You cannot pay for this booking",
          });

        case "PAYMENT_ALREADY_EXISTS":
          return res.status(409).json({
            message:
              "A payment already exists for this booking",
          });

        default:
          if (
            error.message.startsWith(
              "Moyasar payment failed:",
            )
          ) {
            return res.status(502).json({
              message: error.message,
            });
          }

          return res.status(400).json({
            message: error.message,
          });
      }
    }

    next(error);
  }
}

export async function getPaymentController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const paymentId = Number(req.params.id);

    if (
      !Number.isInteger(paymentId) ||
      paymentId < 1
    ) {
      return res.status(400).json({
        message:
          "Payment id must be a positive integer",
      });
    }

    const payment = await getPayment(
      paymentId,
      req.user.id,
    );

    return res.status(200).json(payment);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PAYMENT_NOT_FOUND") {
        return res.status(404).json({
          message: "Payment not found",
        });
      }

      if (error.message === "FORBIDDEN") {
        return res.status(403).json({
          message: "Forbidden",
        });
      }
    }

    next(error);
  }
}

export async function getAllPaymentsController(
  _req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const payments = await getAllPayments();

    return res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
}

export async function webhookController(
  req: Request,
  res: Response,
) {
  try {
    const payment = await handleWebhook(req.body);

    return res.status(200).json({
      received: true,
      payment,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_WEBHOOK_SECRET"
    ) {
      return res.status(401).json({
        message: "Invalid webhook secret",
      });
    }

    if (
      error instanceof Error &&
      error.message === "PAYMENT_NOT_FOUND"
    ) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Webhook processing failed",
    });
  }
}
