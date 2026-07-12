export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export class PaymentEntity {
  id!: number;
  bookingId!: number;
  amount!: number;
  status!: PaymentStatus;
  paymentMethod!: string;
  moyasarPaymentId!: string | null;
  invoiceUrl!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
