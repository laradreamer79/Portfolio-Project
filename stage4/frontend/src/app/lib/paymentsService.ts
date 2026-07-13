import { apiRequest } from "./apiClient";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

type ApiPaymentBooking = {
  id: number;
  numberOfPeople: number;
  totalPrice: string | number;
  status: string;
};

export type ApiPayment = {
  id: number;
  bookingId: number;
  amount: string | number;
  status: PaymentStatus;
  paymentMethod: string;
  moyasarPaymentId: string;
  invoiceUrl: string | null;
  createdAt: string;
  booking?: ApiPaymentBooking;
};

export type CreatePaymentPayload = {
  bookingId: number;
  paymentMethod: string;
  /** Required only in real Moyasar mode — a token collected client-side via Moyasar.js. */
  sourceToken?: string;
};

export type CreatePaymentResult = {
  payment: ApiPayment;
  /** Raw status string from the provider ("mock_pending", "initiated", "paid", etc). */
  providerStatus: string;
  /** Present when 3-D Secure verification is required; redirect the browser here. */
  transactionUrl: string | null;
  /** True when the backend is running in mock mode (no real Moyasar call was made). */
  mock: boolean;
};

export function createPayment(
  payload: CreatePaymentPayload,
  token: string,
) {
  return apiRequest<CreatePaymentResult>("/payments", {
    method: "POST",
    body: payload,
    token,
  });
}

export function getPayment(id: number, token: string) {
  return apiRequest<ApiPayment>(`/payments/${id}`, { token });
}
