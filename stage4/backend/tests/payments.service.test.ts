import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.PAYMENT_PROVIDER_MODE = "moyasar";
process.env.MOYASAR_SECRET_KEY = "test-key";
process.env.MOYASAR_WEBHOOK_SECRET = "test-webhook-secret";

const bookingFindUnique = vi.fn();
const paymentCreate = vi.fn();
const paymentFindUnique = vi.fn();
const paymentUpdate = vi.fn();
const bookingUpdate = vi.fn();
const transaction = vi.fn();
const createMoyasarPayment = vi.fn();

vi.mock("../src/prisma/client.js", () => ({
  prisma: {
    booking: { findUnique: bookingFindUnique },
    payment: {
      create: paymentCreate,
      findUnique: paymentFindUnique,
      update: paymentUpdate,
      findMany: vi.fn(),
    },
    $transaction: transaction,
  },
}));

vi.mock("../src/payments/moyasar.gateway.js", () => ({
  createMoyasarPayment,
  mapMoyasarStatus: (status: string) => status,
}));

const { paymentsService } = await import(
  "../src/payments/payments.service.js"
);

describe("payment retry behavior", () => {
  beforeEach(() => {
    bookingFindUnique.mockReset();
    paymentCreate.mockReset();
    paymentFindUnique.mockReset();
    paymentUpdate.mockReset();
    bookingUpdate.mockReset();
    transaction.mockReset();
    createMoyasarPayment.mockReset();
    transaction.mockImplementation(async (callback) =>
      callback({
        booking: { update: bookingUpdate },
        payment: { create: paymentCreate, update: paymentUpdate },
      }),
    );
  });

  it("keeps a booking pending when its payment fails", async () => {
    bookingFindUnique.mockResolvedValue({
      id: 10,
      userId: 4,
      status: "pending",
      totalPrice: 250,
      payment: null,
    });
    createMoyasarPayment.mockResolvedValue({
      id: "pay_failed",
      status: "failed",
      source: null,
    });
    paymentCreate.mockResolvedValue({ id: 7, status: "failed" });

    await paymentsService.create({
      bookingId: 10,
      userId: 4,
      paymentMethod: "creditcard",
      sourceToken: "token",
    });

    expect(bookingUpdate).not.toHaveBeenCalled();
    expect(paymentCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "failed" }),
      }),
    );
  });

  it("updates a failed payment when the customer retries", async () => {
    bookingFindUnique.mockResolvedValue({
      id: 10,
      userId: 4,
      status: "cancelled",
      totalPrice: 250,
      payment: { id: 7, status: "failed" },
    });
    createMoyasarPayment.mockResolvedValue({
      id: "pay_retry",
      status: "paid",
      source: null,
    });
    paymentUpdate.mockResolvedValue({ id: 7, status: "paid" });

    await paymentsService.create({
      bookingId: 10,
      userId: 4,
      paymentMethod: "creditcard",
      sourceToken: "retry-token",
    });

    expect(bookingUpdate).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { status: "confirmed" },
    });
    expect(paymentUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 7 },
        data: expect.objectContaining({
          status: "paid",
          moyasarPaymentId: "pay_retry",
        }),
      }),
    );
    expect(paymentCreate).not.toHaveBeenCalled();
  });

  it("does not cancel the booking for a failed webhook", async () => {
    paymentFindUnique.mockResolvedValue({ id: 7, bookingId: 10 });
    paymentUpdate.mockResolvedValue({ id: 7, status: "failed" });

    await paymentsService.handleWebhook({
      type: "payment_failed",
      secret_token: "test-webhook-secret",
      data: {
        id: "pay_failed",
        status: "failed",
      },
    });

    expect(bookingUpdate).not.toHaveBeenCalled();
    expect(paymentUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 7 },
        data: { status: "failed" },
      }),
    );
  });
});
