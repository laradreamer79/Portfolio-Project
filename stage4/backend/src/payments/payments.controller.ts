import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  createPayment,
  getPayment,
  getAllPayments,
  handleWebhook,
} from "./payments.service.js";

export async function createPaymentController(
  req: AuthRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { bookingId, paymentMethod } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        message: "bookingId is required",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        message: "paymentMethod is required",
      });
    }

    const payment = await createPayment({
      bookingId: Number(bookingId),
      userId: req.user.id,
      paymentMethod,
    });

    return res.status(201).json(payment);
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "Booking not found":
          return res.status(404).json({
            message: error.message,
          });

        case "Payment already exists":
          return res.status(409).json({
            message: error.message,
          });

        case "FORBIDDEN":
          return res.status(403).json({
            message: "Forbidden",
          });

        default:
          return res.status(400).json({
            message: error.message,
          });
      }
    }

    return res.status(500).json({
      message: "Failed to create payment",
    });
  }
}

export async function getPaymentController(
  req: AuthRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const payment = await getPayment(
      Number(req.params.id),
      req.user.id,
    );

    return res.status(200).json(payment);
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "Payment not found":
          return res.status(404).json({
            message: error.message,
          });

        case "FORBIDDEN":
          return res.status(403).json({
            message: "Forbidden",
          });

        default:
          return res.status(400).json({
            message: error.message,
          });
      }
    }

    return res.status(500).json({
      message: "Failed to get payment",
    });
  }
}

export async function getAllPaymentsController(
  req: AuthRequest,
  res: Response,
) {
  try {
    const payments = await getAllPayments();

    return res.status(200).json(payments);
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to get payments",
    });
  }
}

export async function webhookController(
  req: AuthRequest,
  res: Response,
) {
  try {
    await handleWebhook(req.body);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Webhook failed",
    });
  }
}
