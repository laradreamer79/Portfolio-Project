import axios from "axios";

import { env } from "../config/env.js";
import { prisma } from "../prisma/client.js";

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

function getAxiosErrorMessage(
  error: unknown,
): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    if (
      responseData &&
      typeof responseData === "object"
    ) {
      const message =
        responseData.message ??
        responseData.error ??
        responseData.errors;

      if (typeof message === "string") {
        return message;
      }

      if (message) {
        return JSON.stringify(message);
      }
    }

    return error.message;
  }

  return error instanceof Error
    ? error.message
    : "Payment provider request failed";
}

function mapProviderStatus(
  status: string,
): LocalPaymentStatus {
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

    case "initiated":
    case "authorized":
    case "pending":
    default:
      return "pending";
  }
}

function requireMoyasarKey(): string {
  const key =
    env.moyasarPublishableKey ??
    env.moyasarSecretKey;

  if (!key) {
    throw new Error(
      "Moyasar API key is not configured",
    );
  }

  return key;
}

export async function createPayment(
  data: CreatePaymentInput,
) {
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

  if (booking.status === "confirmed") {
    throw new Error(
      "This booking is already confirmed",
    );
  }

  if (booking.payment) {
    throw new Error("PAYMENT_ALREADY_EXISTS");
  }

  if (
    typeof data.paymentMethod !== "string" ||
    data.paymentMethod.trim().length === 0
  ) {
    throw new Error(
      "paymentMethod is required",
    );
  }

  /*
   * Mock mode:
   * No external request is sent to Moyasar.
   * A local pending payment record is created.
   */
  if (env.paymentProviderMode === "mock") {
    const mockPaymentId =
      `mock_${Date.now()}_${booking.id}`;

    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: booking.totalPrice,
        status: "pending",
        paymentMethod:
          data.paymentMethod.trim(),
        moyasarPaymentId: mockPaymentId,
        invoiceUrl: null,
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

    return {
      payment,
      providerStatus: "mock_pending",
      transactionUrl: null,
      mock: true,
    };
  }

  /*
   * Real Moyasar test mode.
   */
  if (
    typeof data.sourceToken !== "string" ||
    data.sourceToken.trim().length === 0
  ) {
    throw new Error(
      "sourceToken from Moyasar is required",
    );
  }

  const moyasarKey = requireMoyasarKey();

  /*
   * Moyasar expects the amount in halalas.
   * 1 SAR = 100 halalas.
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
          description:
            `Oyster booking #${booking.id}`,
          callback_url:
            env.moyasarCallbackUrl,

          source: {
            type: "token",
            token: data.sourceToken.trim(),
            "3ds": true,
          },

          metadata: {
            bookingId: String(booking.id),
            userId: String(booking.userId),
          },
        },

        {
          auth: {
            username: moyasarKey,
            password: "",
          },

          headers: {
            "Content-Type":
              "application/json",
          },
        },
      );

    const providerPayment = response.data;

    if (
      !providerPayment.id ||
      !providerPayment.status
    ) {
      throw new Error(
        "Invalid response from Moyasar",
      );
    }

    const localStatus =
      mapProviderStatus(
        providerPayment.status,
      );

    const transactionUrl =
      providerPayment.source
        ?.transaction_url ?? null;

    const payment =
      await prisma.$transaction(
        async (transaction) => {
          const createdPayment =
            await transaction.payment.create({
              data: {
                bookingId: booking.id,
                amount: booking.totalPrice,
                status: localStatus,
                paymentMethod:
                  data.paymentMethod.trim(),
                moyasarPaymentId:
                  providerPayment.id,
                invoiceUrl:
                  transactionUrl,
              },

              include: {
                booking: true,
              },
            });

          if (localStatus === "paid") {
            await transaction.booking.update({
              where: {
                id: booking.id,
              },

              data: {
                status: "confirmed",
              },
            });
          }

          return createdPayment;
        },
      );

    return {
      payment,
      providerStatus:
        providerPayment.status,
      transactionUrl,
      mock: false,
    };
  } catch (error) {
    throw new Error(
      `Moyasar payment failed: ${
        getAxiosErrorMessage(error)
      }`,
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
    throw new Error(
      "INVALID_WEBHOOK_SECRET",
    );
  }

  const eventType = payload.type;
  const providerPayment = payload.data;

  if (
    !eventType ||
    !eventType.startsWith("payment_") ||
    !providerPayment?.id ||
    !providerPayment.status
  ) {
    throw new Error(
      "Invalid payment webhook payload",
    );
  }

  const existingPayment =
    await prisma.payment.findUnique({
      where: {
        moyasarPaymentId:
          providerPayment.id,
      },
    });

  if (!existingPayment) {
    throw new Error("PAYMENT_NOT_FOUND");
  }

  const localStatus =
    mapProviderStatus(
      providerPayment.status,
    );

  return prisma.$transaction(
    async (transaction) => {
      const updatedPayment =
        await transaction.payment.update({
          where: {
            id: existingPayment.id,
          },

          data: {
            status: localStatus,
          },

          include: {
            booking: true,
          },
        });

      if (localStatus === "paid") {
        await transaction.booking.update({
          where: {
            id: existingPayment.bookingId,
          },

          data: {
            status: "confirmed",
          },
        });
      }

      if (localStatus === "refunded") {
        await transaction.booking.update({
          where: {
            id: existingPayment.bookingId,
          },

          data: {
            status: "cancelled",
          },
        });
      }

      return updatedPayment;
    },
  );
}
