import { z } from "zod";

const positiveId = z.number().int().positive();
const positiveIdParam = z.coerce.number().int().positive();

export const createPaymentSchema = z
  .object({
    bookingId: positiveId,
    paymentMethod: z.string().trim().min(1, "paymentMethod is required"),
    sourceToken: z.string().trim().min(1).optional(),
  })
  .strict();

export const paymentIdParamsSchema = z
  .object({
    id: positiveIdParam,
  })
  .strict();

export const moyasarWebhookSchema = z
  .object({
    id: z.string().optional(),
    type: z.string().min(1),
    secret_token: z.string().optional(),
    live: z.boolean().optional(),
    data: z
      .object({
        id: z.string().min(1),
        status: z.string().min(1),
        amount: z.number().optional(),
        currency: z.string().optional(),
      })
      .passthrough(),
  })
  .passthrough();

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type MoyasarWebhookInput = z.infer<typeof moyasarWebhookSchema>;
