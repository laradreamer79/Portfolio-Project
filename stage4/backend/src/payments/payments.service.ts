import axios from "axios";
import { prisma } from "../prisma/client.js";
import { env } from "../config/env.js";

type LocalPaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

interface CreatePaymentInput {
  bookingId: number;
  userId: number;
  paymentMethod: string;
  sourceToken: string;
}

interface MoyasarPaymentResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  source?: {
    type?: string;
    transaction_url?: string | null;
  };
}

interface MoyasarWebhookPayload {
  id?: string;
  type?: string;
  secret_token?: string;
  live?: boolean;
  data?: {
    id?: string;
    status?: string;
    amount?: number;
    currency?: string;
  };
}

function requireMoyasarSecretKey(): string {
  if (!env.moyasarSecretKey) {
    throw new Error(
      "MOYASAR_SECRET_KEY is not configured",
    );
  }

  return env.moyasarSecretKey;
}

function getAxiosErrorMessage(
  error: unknown,
): string {
  if (axios.isAxiosError(error)) {
    const responseMessage =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.response?.data?.errors;

    if (typeof responseMessage === "string") {
      return responseMessage;
    }

    if (responseMessage) {
      return JSON.stringify(responseMessage);
    }

    return error.message;
  }

  return error instanceof Error
    ? error.message
    : "Payment provider request failed";
}

function mapMoyasarStatus(
  status: string,
): LocalPaymentStatus {
  switch (status) {
    case "paid":
    case "captured":
    case "verified":
      return "paid";

    case "refunded":
      return "refunded";

    case "failed":
    case "voided":
      return "failed";

    case "initiated":
    case "authorized":
    default:
      return "pending";
  }
}

export async function createPayment(
  data: CreatePaymentInput,
) {
  const secretKey = requireMoyasarSecretKey();

  const booking = await prisma.booking.findUnique({
    where: {
      id: data.bookingId,
    },
    include: {
      payment: true,
    },
  });

  if (!booking) {
    throw new Error("BOOKING_NOT_FOUND");
  }

  if (booking.userId !== data.userId) {
    throw new Error("FORBIDDEN");
  }

  if (booking.status === "cancelled") {
    throw new Error(
      "Cancelled bookings cannot be paid",
    );
  }

  if (booking.payment) {
    throw new Error("PAYMENT_ALREADY_EXISTS");
  }

  /*
   * Moyasar expects amounts in the smallest currency
   * unit. For SAR, that means halalas.
   */
  const amountInHalalas = Math.round(
    Number(booking.totalPrice) * 100,
  );

  try {
    const response =
      await axios.post<MoyasarPaymentResponse>(
        `${env.moyasarBaseUrl}/payments`,
        {
          amount: amountInHalalas,
          currency: "SAR",
          description: `Oyster booking #${booking.id}`,
          callback_url: env.moyasarCallbackUrl,

          source: {
            type: "token",
            token: data.sourceToken,
            "3ds": true,
          },

          metadata: {
            bookingId: String(booking.id),
            userId: String(booking.userId),
          },
        },
        {
          auth: {
  username: env.moyasarPublishableKey!,
  password: "",
          },
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

    const moyasarPayment = response.data;
    const localStatus = mapMoyasarStatus(
      moyasarPayment.status,
    );

    const transactionUrl =
      moyasarPayment.source?.transaction_url ??
      null;

    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: booking.totalPrice,
        status: localStatus,
        paymentMethod: data.paymentMethod,
        moyasarPaymentId: moyasarPayment.id,
        invoiceUrl: transactionUrl,
      },
      include: {
        booking: true,
      },
    });

    if (localStatus === "paid") {
      await prisma.booking.update({
        where: {
          id: booking.id,
        },
        data: {
          status: "confirmed",
        },
      });
    }

    return {
      payment,
      moyasarStatus: moyasarPayment.status,
      transactionUrl,
    };
  } catch (error) {
    throw new Error(
      `Moyasar payment failed: ${getAxiosErrorMessage(error)}`,
    );
  }
}

export async function getPayment(
  paymentId: number,
  userId: number,
) {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      booking: {
        include: {
          trip: true,
          course: true,
        },
      },
    },
  });

  if (!payment) {
    throw new Error("PAYMENT_NOT_FOUND");
  }

  if (payment.booking.userId !== userId) {
    throw new Error("FORBIDDEN");
  }

  return payment;
}

export async function getAllPayments() {
  return prisma.payment.findMany({
    include: {
      booking: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          trip: true,
          course: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function handleWebhook(
  payload: MoyasarWebhookPayload,
) {
  if (!env.moyasarWebhookSecret) {
    throw new Error(
      "MOYASAR_WEBHOOK_SECRET is not configured",
    );
  }

  if (
    payload.secret_token !==
    env.moyasarWebhookSecret
  ) {
    throw new Error("INVALID_WEBHOOK_SECRET");
  }

  const eventType = payload.type;
  const moyasarPayment = payload.data;

  if (
    !eventType ||
    !eventType.startsWith("payment_") ||
    !moyasarPayment?.id ||
    !moyasarPayment.status
  ) {
    throw new Error(
      "Invalid Moyasar webhook payload",
    );
  }

  const existingPayment =
    await prisma.payment.findUnique({
      where: {
        moyasarPaymentId: moyasarPayment.id,
      },
    });

  if (!existingPayment) {
    throw new Error("PAYMENT_NOT_FOUND");
  }

  const localStatus = mapMoyasarStatus(
    moyasarPayment.status,
  );

  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.update({
      where: {
        id: existingPayment.id,
      },
      data: {
        status: localStatus,
      },
    });

    if (localStatus === "paid") {
      await tx.booking.update({
        where: {
          id: existingPayment.bookingId,
        },
        data: {
          status: "confirmed",
        },
      });
    } else if (localStatus === "refunded") {
      await tx.booking.update({
        where: {
          id: existingPayment.bookingId,
        },
        data: {
          status: "cancelled",
        },
      });
    }

    /*
     * A failed payment leaves the booking pending so
     * your application can allow another payment attempt
     * after explicitly replacing or resetting the record.
     */
    return payment;
  });
}
