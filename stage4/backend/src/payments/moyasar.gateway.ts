import { z } from "zod";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";

export type LocalPaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

const moyasarPaymentSchema = z
  .object({
    id: z.string().min(1),
    status: z.string().min(1),
    amount: z.number().optional(),
    currency: z.string().optional(),
    source: z
      .object({
        type: z.string().optional(),
        transaction_url: z.string().nullable().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

type CreateMoyasarPaymentInput = {
  amountInHalalas: number;
  bookingId: number;
  sourceToken: string;
  userId: number;
};

export function mapMoyasarStatus(status: string): LocalPaymentStatus {
  switch (status.toLowerCase()) {
    case "paid":
    case "captured":
    case "verified":
      return "paid";

    case "refunded":
      return "refunded";

    case "failed":
    case "voided":
    case "canceled":
    case "cancelled":
      return "failed";

    default:
      return "pending";
  }
}

function requireMoyasarKey() {
  if (!env.moyasarSecretKey) {
    throw new HttpError(500, "Moyasar secret key is not configured");
  }

  return env.moyasarSecretKey;
}

async function moyasarErrorMessage(response: Response) {
  const responseData = await response.json().catch(() => null);

  if (responseData && typeof responseData === "object") {
    const data = responseData as {
      message?: unknown;
      error?: unknown;
      errors?: unknown;
    };
    const message = data.message ?? data.error ?? data.errors;

    if (typeof message === "string") return message;
    if (message) return JSON.stringify(message);
  }

  return `Moyasar returned ${response.status}`;
}

export async function createMoyasarPayment(
  input: CreateMoyasarPaymentInput,
) {
  const key = requireMoyasarKey();
  let response: Response;

  try {
    response = await fetch(`${env.moyasarBaseUrl}/payments`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${key}:`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: input.amountInHalalas,
        currency: "SAR",
        description: `Oyster booking #${input.bookingId}`,
        callback_url: env.moyasarCallbackUrl,
        source: {
          type: "token",
          token: input.sourceToken,
          "3ds": true,
        },
        metadata: {
          bookingId: String(input.bookingId),
          userId: String(input.userId),
        },
      }),
    });
  } catch {
    throw new HttpError(502, "Unable to reach Moyasar");
  }

  if (!response.ok) {
    throw new HttpError(502, await moyasarErrorMessage(response));
  }

  const result = moyasarPaymentSchema.safeParse(
    await response.json().catch(() => null),
  );

  if (!result.success) {
    throw new HttpError(502, "Invalid response from Moyasar");
  }

  return result.data;
}
