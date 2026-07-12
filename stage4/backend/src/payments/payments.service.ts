
import axios from "axios";
import { prisma } from "../prisma/client.js";
import { env } from "../config/env.js";

interface CreatePaymentInput {
  bookingId: number;
  userId: number;
  paymentMethod: string;
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
    throw new Error("Booking not found");
  }

  if (booking.userId !== data.userId) {
    throw new Error("FORBIDDEN");
  }

  if (booking.payment) {
    throw new Error("Payment already exists");
  }

  const auth = Buffer.from(
    `${env.moyasarApiKey}:`,
  ).toString("base64");

  const response = await axios.post(
    `${env.moyasarBaseUrl}/payments`,
    {
      amount: Number(booking.totalPrice) * 100,

      currency: "SAR",

      description: `Booking #${booking.id}`,

      callback_url:
        "http://localhost:3000/api/payments/webhook",

      source: {
        type: "creditcard",
        name: data.paymentMethod,
      },
    },
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    },
  );

  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,

      amount: booking.totalPrice,

      paymentMethod: data.paymentMethod,

      status: response.data.status,

      moyasarPaymentId: response.data.id,
    },
  });

  return {
    payment,
    checkoutUrl:
      response.data.invoice_url ??
      response.data.source?.transaction_url ??
      null,
  };
}

export async function getPayment(
  id: number,
  userId: number,
) {
  const payment = await prisma.payment.findUnique({
    where: {
      id,
    },
    include: {
      booking: true,
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
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
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function handleWebhook(
  payload: any,
) {
  const paymentId = payload.id;

  const status = payload.status;

  const payment =
    await prisma.payment.findFirst({
      where: {
        moyasarPaymentId: paymentId,
      },
    });

  if (!payment) {
    throw new Error("Payment not found");
  }

  await prisma.payment.update({
    where: {
      id: payment.id,
    },
    data: {
      status,
    },
  });

  if (status === "paid") {
    await prisma.booking.update({
      where: {
        id: payment.bookingId,
      },
      data: {
        status: "confirmed",
      },
    });
  }

  if (
    status === "failed" ||
    status === "canceled"
  ) {
    await prisma.booking.update({
      where: {
        id: payment.bookingId,
      },
      data: {
        status: "cancelled",
      },
    });
  }

  return {
    success: true,
  };
}
