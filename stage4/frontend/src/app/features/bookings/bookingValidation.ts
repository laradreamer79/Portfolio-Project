import {
  isValidEmail,
  isValidPersonName,
  isValidSaudiPhone,
} from "../../lib/validation";
import type { BookingFormState, PaymentFormState } from "./useBookingFlow";

export function validateBookingDetails(form: BookingFormState) {
  if (!isValidPersonName(form.name)) {
    return "Enter a valid full name using at least two letters.";
  }

  if (!isValidEmail(form.email)) {
    return "Enter a valid email address.";
  }

  if (!isValidSaudiPhone(form.phone)) {
    return "Enter a Saudi phone number such as 05XXXXXXXX or +9665XXXXXXXX.";
  }

  return null;
}

export function validatePaymentDetails(payment: PaymentFormState) {
  const cardDigits = payment.card.replace(/\D/g, "");
  if (cardDigits.length !== 16) {
    return "Card number must contain 16 digits.";
  }

  const checksum = [...cardDigits]
    .reverse()
    .reduce((sum, digit, index) => {
      const value = Number(digit);
      if (index % 2 === 0) return sum + value;
      const doubled = value * 2;
      return sum + (doubled > 9 ? doubled - 9 : doubled);
    }, 0);

  if (checksum % 10 !== 0) {
    return "Enter a valid card number.";
  }

  const expiryMatch = payment.expiry.match(/^(0[1-9]|1[0-2]) \/ (\d{2})$/);
  if (!expiryMatch) {
    return "Enter the expiry date as MM / YY.";
  }

  const expiryMonth = Number(expiryMatch[1]);
  const expiryYear = 2000 + Number(expiryMatch[2]);
  const now = new Date();
  const expiryEnd = new Date(expiryYear, expiryMonth, 0, 23, 59, 59, 999);
  if (expiryEnd.getTime() < now.getTime()) {
    return "The card expiry date has passed.";
  }

  if (!/^\d{3,4}$/.test(payment.cvv)) {
    return "CVV must contain 3 or 4 digits.";
  }

  if (!isValidPersonName(payment.holder)) {
    return "Enter a valid cardholder name.";
  }

  return null;
}

export function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)} / ${digits.slice(2)}`
    : digits;
}

export function formatCvv(value: string) {
  return value.replace(/\D/g, "").slice(0, 4);
}
