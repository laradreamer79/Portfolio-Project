import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getPayment, type ApiPayment } from "./paymentService";

const STORAGE_KEY = "oyster_pending_payment_id";
const MAX_ATTEMPTS = 8;
const POLL_INTERVAL_MS = 2000;

export type PaymentCallbackState =
  | "checking"
  | "paid"
  | "failed"
  | "pending_timeout"
  | "no_record";

export function usePaymentCallback() {
  const { token } = useAuth();
  const [state, setState] = useState<PaymentCallbackState>("checking");
  const [payment, setPayment] = useState<ApiPayment | null>(null);

  useEffect(() => {
    const localPaymentId = sessionStorage.getItem(STORAGE_KEY);

    if (!localPaymentId || !token) {
      setState("no_record");
      return;
    }

    let active = true;
    let attempts = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    async function poll() {
      try {
        const result = await getPayment(Number(localPaymentId), token as string);
        if (!active) return;

        setPayment(result);

        if (result.status === "paid" || result.status === "failed") {
          sessionStorage.removeItem(STORAGE_KEY);
          setState(result.status);
          return;
        }

        attempts += 1;
        if (attempts >= MAX_ATTEMPTS) {
          setState("pending_timeout");
          return;
        }

        timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
      } catch {
        if (active) setState("failed");
      }
    }

    void poll();

    return () => {
      active = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [token]);

  return {
    state,
    bookingId: payment?.bookingId,
  };
}
