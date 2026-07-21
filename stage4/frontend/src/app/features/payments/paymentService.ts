import { apiRequest } from "../../lib/apiClient";

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
  sourceToken?: string;
};

export type CreatePaymentResult = {
  payment: ApiPayment;
  providerStatus: string;
  transactionUrl: string | null;
  mock: boolean;
};

export function createPayment(payload: CreatePaymentPayload, token: string) {
  return apiRequest<CreatePaymentResult>("/payments", {
    method: "POST",
    body: payload,
    token,
  });
}

export function getPayment(id: number, token: string) {
  return apiRequest<ApiPayment>(`/payments/${id}`, { token });
}
