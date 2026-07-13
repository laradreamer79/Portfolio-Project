import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { getPayment, type ApiPayment } from "../lib/paymentsService";
import { useAuth } from "../hooks/useAuth";

const STORAGE_KEY = "oyster_pending_payment_id";
const MAX_ATTEMPTS = 8;
const POLL_INTERVAL_MS = 2000;

type CallbackState = "checking" | "paid" | "failed" | "pending_timeout" | "no_record";

export function PaymentCallback() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [state, setState] = useState<CallbackState>("checking");
  const [payment, setPayment] = useState<ApiPayment | null>(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    const localPaymentId = sessionStorage.getItem(STORAGE_KEY);

    if (!localPaymentId || !token) {
      setState("no_record");
      return;
    }

    let active = true;

    async function poll() {
      try {
        const result = await getPayment(Number(localPaymentId), token as string);
        if (!active) return;

        setPayment(result);

        if (result.status === "paid") {
          sessionStorage.removeItem(STORAGE_KEY);
          setState("paid");
          return;
        }

        if (result.status === "failed") {
          sessionStorage.removeItem(STORAGE_KEY);
          setState("failed");
          return;
        }

        // Still "pending" or "refunded" mid-flow: keep polling for the webhook.
        attemptsRef.current += 1;
        if (attemptsRef.current >= MAX_ATTEMPTS) {
          setState("pending_timeout");
          return;
        }

        setTimeout(poll, POLL_INTERVAL_MS);
      } catch {
        if (!active) return;
        setState("failed");
      }
    }

    poll();

    return () => {
      active = false;
    };
  }, [token]);

  const bookingId = payment?.bookingId;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-8 px-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-100 p-10 text-center space-y-5">
        {state === "checking" && (
          <>
            <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide">
                CONFIRMING YOUR PAYMENT
              </h2>
              <p className="text-slate-400 mt-2 text-sm">
                Please wait while we verify your payment with Moyasar. This usually takes a few seconds.
              </p>
            </div>
          </>
        )}

        {state === "paid" && (
          <>
            <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-teal-500" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide">
                PAYMENT CONFIRMED!
              </h2>
              <p className="text-slate-400 mt-2 text-sm">Your booking has been confirmed.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/")}
                className="flex-1 border border-slate-200 text-slate-600 font-medium py-3 rounded-xl hover:border-slate-300 transition-colors text-sm"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate(bookingId ? `/bookings/${bookingId}` : "/dashboard")}
                className="flex-1 bg-teal-500 text-white font-semibold py-3 rounded-xl hover:bg-teal-600 transition-colors text-sm"
              >
                View Booking
              </button>
            </div>
          </>
        )}

        {state === "failed" && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide">
                PAYMENT FAILED
              </h2>
              <p className="text-slate-400 mt-2 text-sm">
                Your payment could not be completed. No charge should have been made. Please try again.
              </p>
            </div>
            <button
              onClick={() => navigate(bookingId ? `/bookings/${bookingId}` : "/dashboard")}
              className="w-full bg-teal-500 text-white font-semibold py-3 rounded-xl hover:bg-teal-600 transition-colors text-sm"
            >
              Back to My Bookings
            </button>
          </>
        )}

        {state === "pending_timeout" && (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide">
                STILL PROCESSING
              </h2>
              <p className="text-slate-400 mt-2 text-sm">
                Your payment is taking longer than expected to confirm. Check your bookings shortly — we'll
                update the status automatically once Moyasar confirms it.
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-teal-500 text-white font-semibold py-3 rounded-xl hover:bg-teal-600 transition-colors text-sm"
            >
              Go to My Bookings
            </button>
          </>
        )}

        {state === "no_record" && (
          <>
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide">
                NOTHING TO CONFIRM
              </h2>
              <p className="text-slate-400 mt-2 text-sm">
                We couldn't find a pending payment for this session. If you just completed a payment, check
                your bookings — it may already be confirmed.
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-teal-500 text-white font-semibold py-3 rounded-xl hover:bg-teal-600 transition-colors text-sm"
            >
              Go to My Bookings
            </button>
          </>
        )}
      </div>
    </div>
  );
}
