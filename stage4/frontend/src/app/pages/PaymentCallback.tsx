import { useNavigate } from "react-router-dom";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { usePaymentCallback } from "../features/payments";

export function PaymentCallback() {
  const navigate = useNavigate();
  const { state, bookingId } = usePaymentCallback();

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
                Please wait while we verify your payment status.
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
                Your payment could not be completed. Please try again.
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
                Your payment is taking longer than expected. Check your bookings shortly.
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
                We could not find a pending payment for this session.
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
