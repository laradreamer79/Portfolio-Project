import { env } from "../config/env.js";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma/client.js";
import { HttpError } from "../utils/http-error.js";
import {
  createMoyasarPayment,
  mapMoyasarStatus,
} from "./moyasar.gateway.js";
import type {
  CreatePaymentInput,
  MoyasarWebhookInput,
} from "./payments.validation.js";

type CreatePaymentCommand = CreatePaymentInput & {
  userId: number;
};

const paymentWithBooking = {
  booking: {
    include: {
      trip: true,
      course: true,
    },
  },
} satisfies Prisma.PaymentInclude;

function throwPaymentConflict(error: unknown): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new HttpError(
      409,
      "A payment already exists for this booking",
    );
  }

  throw error;
}

async function createMockPayment(
  booking: {
    id: number;
    totalPrice: Prisma.Decimal;
  },
  paymentMethod: string,
) {
  try {
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: booking.totalPrice,
        status: "pending",
        paymentMethod,
        moyasarPaymentId: `mock_${Date.now()}_${booking.id}`,
        invoiceUrl: null,
      },
      include: paymentWithBooking,
    });

    return {
      payment,
      providerStatus: "mock_pending",
      transactionUrl: null,
      mock: true,
    };
  } catch (error) {
    throwPaymentConflict(error);
  }
}

async function create(data: CreatePaymentCommand) {
  const booking = await prisma.booking.findUnique({
    where: { id: data.bookingId },
    include: { payment: true },
  });

  if (!booking) {
    throw new HttpError(404, "Booking not found");
  }

  if (booking.userId !== data.userId) {
    throw new HttpError(403, "You cannot pay for this booking");
  }

  if (booking.status === "cancelled") {
    throw new HttpError(409, "Cancelled bookings cannot be paid");
  }

  if (booking.status === "confirmed") {
    throw new HttpError(409, "This booking is already confirmed");
  }

  if (booking.payment) {
    throw new HttpError(
      409,
      "A payment already exists for this booking",
    );
  }

  if (env.paymentProviderMode === "mock") {
    return createMockPayment(booking, data.paymentMethod);
  }

  if (!data.sourceToken) {
    throw new HttpError(400, "sourceToken from Moyasar is required");
  }

  const providerPayment = await createMoyasarPayment({
    amountInHalalas: Math.round(Number(booking.totalPrice) * 100),
    bookingId: booking.id,
    sourceToken: data.sourceToken,
    userId: booking.userId,
  });
  const localStatus = mapMoyasarStatus(providerPayment.status);
  const transactionUrl =
    providerPayment.source?.transaction_url ?? null;

  try {
    const payment = await prisma.$transaction(async (transaction) => {
      if (localStatus === "paid") {
        await transaction.booking.update({
          where: { id: booking.id },
          data: { status: "confirmed" },
        });
      }

      return transaction.payment.create({
        data: {
          bookingId: booking.id,
          amount: booking.totalPrice,
          status: localStatus,
          paymentMethod: data.paymentMethod,
          moyasarPaymentId: providerPayment.id,
          invoiceUrl: transactionUrl,
        },
        include: paymentWithBooking,
      });
    });

    return {
      payment,
      providerStatus: providerPayment.status,
      transactionUrl,
      mock: false,
    };
  } catch (error) {
    throwPaymentConflict(error);
  }
}

async function getById(paymentId: number, userId: number) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: paymentWithBooking,
  });

  if (!payment) {
    throw new HttpError(404, "Payment not found");
  }

  if (payment.booking.userId !== userId) {
    throw new HttpError(403, "Forbidden");
  }

  return payment;
}

async function getAll() {
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
    orderBy: { createdAt: "desc" },
  });
}

async function handleWebhook(payload: MoyasarWebhookInput) {
  if (!env.moyasarWebhookSecret) {
    throw new HttpError(
      500,
      "MOYASAR_WEBHOOK_SECRET is not configured",
    );
  }

  if (payload.secret_token !== env.moyasarWebhookSecret) {
    throw new HttpError(401, "Invalid webhook secret");
  }

  if (!payload.type.startsWith("payment_")) {
    throw new HttpError(400, "Invalid payment webhook payload");
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { moyasarPaymentId: payload.data.id },
  });

  if (!existingPayment) {
    throw new HttpError(404, "Payment not found");
  }

  const localStatus = mapMoyasarStatus(payload.data.status);

  return prisma.$transaction(async (transaction) => {
    if (localStatus === "paid") {
      await transaction.booking.update({
        where: { id: existingPayment.bookingId },
        data: { status: "confirmed" },
      });
    }

    if (localStatus === "refunded") {
      await transaction.booking.update({
        where: { id: existingPayment.bookingId },
        data: { status: "cancelled" },
      });
    }

    return transaction.payment.update({
      where: { id: existingPayment.id },
      data: { status: localStatus },
      include: { booking: true },
    });
  });
}

export const paymentsService = {
  create,
  getById,
  getAll,
  handleWebhook,
};
