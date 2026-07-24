import {
  CheckCircle,
  ChevronLeft,
  CreditCard,
  Lock,
  Calendar,
  Waves,
  Clock,
  Users,
  MapPin,
  AlertTriangle,
} from "lucide-react";

import {
  detectCardBrand,
  formatCardNumber,
  formatCvv,
  formatExpiry,
  useBookingFlow,
} from "../features/bookings";

export function Booking() {
  const {
    center,
    confirmedBooking,
    confirmedPayment,
    divers,
    experience,
    experienceType,
    form,
    handleDetailsContinue,
    handlePay,
    isSubmitting,
    loading,
    loadError,
    navigate,
    past,
    payment,
    paymentErrors,
    setDivers,
    setFormField,
    setPaymentField,
    setPaymentValue,
    setStep,
    step,
    stepIdx,
    submitError,
    total,
    validationError,
  } = useBookingFlow();

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-400">
        Loading booking details...
      </div>
    );
  }

  if (loadError || !experience || !experienceType) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-slate-400">
          {loadError ?? "Listing not found."}
        </p>

        <button
          onClick={() => navigate("/trips")}
          className="text-sm font-medium text-teal-600"
        >
          ← Back to Trips
        </button>
      </div>
    );
  }

  const trip = experience;
  const cardBrand = detectCardBrand(payment.card);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-5xl px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="mb-8 font-display text-4xl font-bold tracking-wide text-slate-900">
          BOOKING REQUEST
        </h1>

        {past && step !== "success" && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />

            <div className="text-sm">
              <p className="font-semibold">
                This date has already passed.
              </p>

              <p className="mt-1">
                {trip.type === "course"
                  ? "This course"
                  : "This trip"}{" "}
                was scheduled for {trip.date}, which is in the past, so
                it can no longer be booked. Please choose an upcoming
                listing instead.
              </p>
            </div>
          </div>
        )}

        {step !== "success" && (
          <div className="mb-8 flex items-center gap-3">
            {[
              { label: "Your Details", idx: 0 },
              { label: "Payment", idx: 1 },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2"
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    stepIdx >= item.idx
                      ? "bg-teal-500 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {item.idx + 1}
                </div>

                <span
                  className={`text-sm font-medium ${
                    stepIdx >= item.idx
                      ? "text-teal-600"
                      : "text-slate-400"
                  }`}
                >
                  {item.label}
                </span>

                {item.idx < 1 && (
                  <div className="mx-1 h-px w-8 bg-slate-200" />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {step === "details" && (
              <div className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6">
                <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">
                  Your Details
                </h2>

                {validationError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {validationError}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Full Name *
                    </label>

                    <input
                      autoComplete="name"
                      minLength={2}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-teal-400 focus:outline-none"
                      placeholder="Mohammed Al-Rashid"
                      value={form.name}
                      onChange={setFormField("name")}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Email Address *
                    </label>

                    <input
                      type="email"
                      autoComplete="email"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-teal-400 focus:outline-none"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={setFormField("email")}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Phone Number *
                    </label>

                    <input
                      type="tel"
                      autoComplete="tel"
                      inputMode="numeric"
                      maxLength={10}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-teal-400 focus:outline-none"
                      placeholder="05XXXXXXXX"
                      value={form.phone}
                      onChange={setFormField("phone")}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Scheduled Date
                    </label>

                    <input
                      disabled
                      readOnly
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500"
                      value={trip.date}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    Number of Divers
                  </label>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setDivers(Math.max(1, divers - 1))
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-600 transition-colors hover:border-teal-400"
                    >
                      −
                    </button>

                    <span className="w-6 text-center text-xl font-bold text-slate-900">
                      {divers}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setDivers(
                          Math.min(trip.slots, divers + 1),
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-600 transition-colors hover:border-teal-400"
                    >
                      +
                    </button>

                    <span className="text-xs text-slate-400">
                      {trip.slots} max
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    Special Requests / Notes
                  </label>

                  <textarea
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-teal-400 focus:outline-none"
                    placeholder="Certification level, equipment needs, accessibility requirements..."
                    value={form.notes}
                    onChange={setFormField("notes")}
                  />
                </div>

                <button
                  onClick={handleDetailsContinue}
                  disabled={past}
                  className="w-full rounded-xl bg-teal-500 py-3 font-semibold text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {step === "payment" && (
              <div className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-teal-600" />

                  <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">
                    Secure Payment
                  </h2>
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {submitError}
                  </div>
                )}

                {/* Card Number */}
                <div
                  className={`rounded-xl border p-4 ${
                    paymentErrors.card
                      ? "border-red-300 bg-red-50"
                      : "border-slate-100 bg-slate-50"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                      Card Number
                    </p>

                    {cardBrand === "visa" && (
                      <span className="rounded bg-blue-700 px-2 py-0.5 text-xs font-bold italic text-white">
                        VISA
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-slate-400" />

                    <input
                      inputMode="numeric"
                      autoComplete="cc-number"
                      aria-invalid={Boolean(paymentErrors.card)}
                      className="flex-1 bg-transparent font-mono text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      value={payment.card}
                      onChange={(event) =>
                        setPaymentValue(
                          "card",
                          formatCardNumber(event.target.value),
                        )
                      }
                    />
                  </div>

                  {paymentErrors.card && (
                    <p
                      role="alert"
                      className="mt-2 text-xs text-red-600"
                    >
                      {paymentErrors.card}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry */}
                  <div
                    className={`rounded-xl border p-4 ${
                      paymentErrors.expiry
                        ? "border-red-300 bg-red-50"
                        : "border-slate-100 bg-slate-50"
                    }`}
                  >
                    <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-400">
                      Expiry Date
                    </p>

                    <input
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      maxLength={7}
                      aria-invalid={Boolean(
                        paymentErrors.expiry,
                      )}
                      className="w-full bg-transparent font-mono text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                      placeholder="MM / YY"
                      value={payment.expiry}
                      onChange={(event) =>
                        setPaymentValue(
                          "expiry",
                          formatExpiry(event.target.value),
                        )
                      }
                    />

                    {paymentErrors.expiry && (
                      <p
                        role="alert"
                        className="mt-2 text-xs text-red-600"
                      >
                        {paymentErrors.expiry}
                      </p>
                    )}
                  </div>

                  {/* CVV */}
                  <div
                    className={`rounded-xl border p-4 ${
                      paymentErrors.cvv
                        ? "border-red-300 bg-red-50"
                        : "border-slate-100 bg-slate-50"
                    }`}
                  >
                    <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-400">
                      CVV
                    </p>

                    <input
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      aria-invalid={Boolean(paymentErrors.cvv)}
                      className="w-full bg-transparent font-mono text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                      placeholder="•••"
                      maxLength={3}
                      type="password"
                      value={payment.cvv}
                      onChange={(event) =>
                        setPaymentValue(
                          "cvv",
                          formatCvv(event.target.value),
                        )
                      }
                    />

                    {paymentErrors.cvv && (
                      <p
                        role="alert"
                        className="mt-2 text-xs text-red-600"
                      >
                        {paymentErrors.cvv}
                      </p>
                    )}
                  </div>
                </div>

                {/* Cardholder Name */}
                <div
                  className={`rounded-xl border p-4 ${
                    paymentErrors.holder
                      ? "border-red-300 bg-red-50"
                      : "border-slate-100 bg-slate-50"
                  }`}
                >
                  <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-400">
                    Cardholder Name
                  </p>

                  <input
                    autoComplete="cc-name"
                    aria-invalid={Boolean(paymentErrors.holder)}
                    className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                    placeholder="Name as on card"
                    value={payment.holder}
                    onChange={setPaymentField("holder")}
                  />

                  {paymentErrors.holder && (
                    <p
                      role="alert"
                      className="mt-2 text-xs text-red-600"
                    >
                      {paymentErrors.holder}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-400">
                  <Lock className="h-3.5 w-3.5" />
                  Demo payment form — card details are not sent from
                  this form. Confirming creates a real booking and
                  payment record.
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("details")}
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-500 transition-colors hover:border-slate-300 disabled:opacity-40"
                  >
                    ← Back
                  </button>

                  <button
                    onClick={handlePay}
                    disabled={isSubmitting || past}
                    className="flex-1 rounded-xl bg-teal-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSubmitting
                      ? "Processing..."
                      : `Pay SAR ${total.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="space-y-5 rounded-2xl border border-slate-100 bg-white p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-teal-100 bg-teal-50">
                  <CheckCircle className="h-8 w-8 text-teal-500" />
                </div>

                <div>
                  <h2 className="font-display text-4xl font-bold tracking-wide text-slate-900">
                    BOOKING CONFIRMED!
                  </h2>

                  <p className="mt-2 text-slate-400">
                    A confirmation has been sent to {form.email}
                  </p>
                </div>

                <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">
                      Booking Reference
                    </span>

                    <span className="font-mono font-bold text-teal-600">
                      OYS-
                      {String(
                        confirmedBooking?.id ?? "",
                      ).padStart(6, "0")}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">
                      {trip.type === "course"
                        ? "Course"
                        : "Trip"}
                    </span>

                    <span className="font-medium text-slate-800">
                      {trip.title}
                    </span>
                  </div>

                  {center && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">
                        Center
                      </span>

                      <span className="text-slate-800">
                        {center.name}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">
                      Divers
                    </span>

                    <span className="text-slate-800">
                      {confirmedBooking?.numberOfPeople ??
                        divers}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">
                      Status
                    </span>

                    <span className="capitalize text-slate-800">
                      {confirmedBooking?.status ?? "pending"}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">
                      Payment
                    </span>

                    <span className="capitalize text-slate-800">
                      {confirmedPayment?.status ?? "pending"}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                    <span className="text-slate-400">
                      Total
                    </span>

                    <span className="text-lg font-bold text-teal-600">
                      SAR{" "}
                      {Number(
                        confirmedBooking?.totalPrice ??
                          total,
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/")}
                    className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300"
                  >
                    Back to Home
                  </button>

                  <button
                    onClick={() => navigate("/dashboard")}
                    className="flex-1 rounded-xl bg-teal-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-600"
                  >
                    View My Bookings
                  </button>
                </div>
              </div>
            )}
          </div>

          {step !== "success" && (
            <div className="space-y-4">
              <div className="sticky top-24 overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <div className="h-36 overflow-hidden">
                  <img
                    src={trip.img}
                    alt={trip.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <span
                    className={`mb-2 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                      trip.type === "course"
                        ? "bg-purple-50 text-purple-700"
                        : "bg-teal-50 text-teal-700"
                    }`}
                  >
                    {trip.type === "course"
                      ? "Course"
                      : "Trip"}
                  </span>

                  <h3 className="mt-1 font-display text-xl font-bold tracking-wide text-slate-900">
                    {trip.title}
                  </h3>

                  {center && (
                    <p className="mb-4 mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <MapPin className="h-3 w-3 text-teal-500" />
                      {center.name} · {center.city}
                    </p>
                  )}

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-300" />
                      {trip.duration}
                    </div>

                    <div className="flex items-center gap-2">
                      <Waves className="h-3.5 w-3.5 text-slate-300" />
                      {trip.depth}
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-slate-300" />
                      {trip.level}
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-300" />
                      {trip.date}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                    <div className="flex justify-between text-slate-500">
                      <span>
                        SAR {trip.price} × {divers} diver
                        {divers > 1 ? "s" : ""}
                      </span>

                      <span>
                        SAR {total.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-base font-bold text-slate-900">
                      <span>Total</span>

                      <span className="text-teal-600">
                        SAR {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
