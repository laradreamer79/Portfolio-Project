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
    return <div className="flex items-center justify-center h-96 text-slate-400">Loading booking details...</div>;
  }

  if (loadError || !experience || !experienceType) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-slate-400">{loadError ?? "Listing not found."}</p>
        <button onClick={() => navigate("/trips")} className="text-teal-600 text-sm font-medium">
          ← Back to Trips
        </button>
      </div>
    );
  }

  const trip = experience;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="font-display text-4xl font-bold text-slate-900 tracking-wide mb-8">BOOKING REQUEST</h1>

        {past && step !== "success" && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold">This date has already passed.</p>
              <p className="mt-1">
                {trip.type === "course" ? "This course" : "This trip"} was scheduled for {trip.date}, which is in the
                past, so it can no longer be booked. Please choose an upcoming listing instead.
              </p>
            </div>
          </div>
        )}

        {/* Progress */}
        {step !== "success" && (
          <div className="flex items-center gap-3 mb-8">
            {[{ label: "Your Details", idx: 0 }, { label: "Payment", idx: 1 }].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${stepIdx >= s.idx ? "bg-teal-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                  {s.idx + 1}
                </div>
                <span className={`text-sm font-medium ${stepIdx >= s.idx ? "text-teal-600" : "text-slate-400"}`}>{s.label}</span>
                {s.idx < 1 && <div className="w-8 h-px bg-slate-200 mx-1" />}
              </div>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === "details" && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide">Your Details</h2>
                {validationError && (
                  <div role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {validationError}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1.5">Full Name *</label>
                    <input autoComplete="name" minLength={2} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors" placeholder="Mohammed Al-Rashid" value={form.name} onChange={setFormField("name")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1.5">Email Address *</label>
                    <input type="email" autoComplete="email" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors" placeholder="your@email.com" value={form.email} onChange={setFormField("email")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1.5">Phone Number *</label>
                    <input type="tel" autoComplete="tel" inputMode="tel" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors" placeholder="05XXXXXXXX or +9665XXXXXXXX" value={form.phone} onChange={setFormField("phone")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1.5">Scheduled Date</label>
                    <input disabled className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 bg-slate-50" value={trip.date} readOnly />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1.5">Number of Divers</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setDivers(Math.max(1, divers - 1))} className="w-9 h-9 rounded-full border border-slate-200 text-slate-600 hover:border-teal-400 transition-colors flex items-center justify-center text-lg">−</button>
                    <span className="font-bold text-slate-900 text-xl w-6 text-center">{divers}</span>
                    <button onClick={() => setDivers(Math.min(trip.slots, divers + 1))} className="w-9 h-9 rounded-full border border-slate-200 text-slate-600 hover:border-teal-400 transition-colors flex items-center justify-center text-lg">+</button>
                    <span className="text-xs text-slate-400">{trip.slots} max</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1.5">Special Requests / Notes</label>
                  <textarea rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors resize-none" placeholder="Certification level, equipment needs, accessibility requirements..." value={form.notes} onChange={setFormField("notes")} />
                </div>
                <button
                  onClick={handleDetailsContinue}
                  disabled={past}
                  className="w-full bg-teal-500 text-white font-semibold py-3 rounded-xl hover:bg-teal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {step === "payment" && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-600" />
                  <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide">Secure Payment</h2>
                </div>

                {submitError && (
                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {submitError}
                  </div>
                )}

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-widest">Card Number</p>
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-slate-400" />
                    <input inputMode="numeric" autoComplete="cc-number" className="flex-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent font-mono" placeholder="4242 4242 4242 4242" maxLength={19} value={payment.card} onChange={(event) => setPaymentValue("card", formatCardNumber(event.target.value))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-widest">Expiry Date</p>
                    <input inputMode="numeric" autoComplete="cc-exp" maxLength={7} className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent font-mono" placeholder="MM / YY" value={payment.expiry} onChange={(event) => setPaymentValue("expiry", formatExpiry(event.target.value))} />
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-widest">CVV</p>
                    <input inputMode="numeric" autoComplete="cc-csc" className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent font-mono" placeholder="•••" maxLength={4} type="password" value={payment.cvv} onChange={(event) => setPaymentValue("cvv", formatCvv(event.target.value))} />
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-widest">Cardholder Name</p>
                  <input autoComplete="cc-name" className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent" placeholder="Name as on card" value={payment.holder} onChange={setPaymentField("holder")} />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <Lock className="w-3.5 h-3.5" />
                  Demo payment form — card details are not sent from this form. Confirming creates a real booking and payment record.
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep("details")} disabled={isSubmitting} className="flex-1 border border-slate-200 text-slate-500 font-medium py-3 rounded-xl hover:border-slate-300 transition-colors text-sm disabled:opacity-40">← Back</button>
                  <button
                    onClick={handlePay}
                    disabled={isSubmitting || past}
                    className="flex-1 bg-teal-500 text-white font-semibold py-3 rounded-xl hover:bg-teal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                  >
                    {isSubmitting ? "Processing..." : `Pay SAR ${total.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-teal-500" />
                </div>
                <div>
                  <h2 className="font-display text-4xl font-bold text-slate-900 tracking-wide">BOOKING CONFIRMED!</h2>
                  <p className="text-slate-400 mt-2">A confirmation has been sent to {form.email}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Booking Reference</span><span className="font-mono font-bold text-teal-600">OYS-{String(confirmedBooking?.id ?? "").padStart(6, "0")}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">{trip.type === "course" ? "Course" : "Trip"}</span><span className="text-slate-800 font-medium">{trip.title}</span></div>
                  {center && <div className="flex justify-between text-sm"><span className="text-slate-400">Center</span><span className="text-slate-800">{center.name}</span></div>}
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Divers</span><span className="text-slate-800">{confirmedBooking?.numberOfPeople ?? divers}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Status</span><span className="text-slate-800 capitalize">{confirmedBooking?.status ?? "pending"}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Payment</span><span className="text-slate-800 capitalize">{confirmedPayment?.status ?? "pending"}</span></div>
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-200"><span className="text-slate-400">Total</span><span className="font-bold text-teal-600 text-lg">SAR {Number(confirmedBooking?.totalPrice ?? total).toLocaleString()}</span></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => navigate("/")} className="flex-1 border border-slate-200 text-slate-600 font-medium py-3 rounded-xl hover:border-slate-300 transition-colors text-sm">Back to Home</button>
                  <button onClick={() => navigate("/dashboard")} className="flex-1 bg-teal-500 text-white font-semibold py-3 rounded-xl hover:bg-teal-600 transition-colors text-sm">View My Bookings</button>
                </div>
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          {step !== "success" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden sticky top-24">
                <div className="h-36 overflow-hidden">
                  <img src={trip.img} alt={trip.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-2 inline-block ${trip.type === "course" ? "bg-purple-50 text-purple-700" : "bg-teal-50 text-teal-700"}`}>
                    {trip.type === "course" ? "Course" : "Trip"}
                  </span>
                  <h3 className="font-display text-xl font-bold text-slate-900 tracking-wide mt-1">{trip.title}</h3>
                  {center && (
                    <p className="text-slate-400 text-xs flex items-center gap-1 mt-1 mb-4">
                      <MapPin className="w-3 h-3 text-teal-500" />{center.name} · {center.city}
                    </p>
                  )}
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-slate-300" />{trip.duration}</div>
                    <div className="flex items-center gap-2"><Waves className="w-3.5 h-3.5 text-slate-300" />{trip.depth}</div>
                    <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-slate-300" />{trip.level}</div>
                    <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-slate-300" />{trip.date}</div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-sm">
                    <div className="flex justify-between text-slate-500"><span>SAR {trip.price} × {divers} diver{divers > 1 ? "s" : ""}</span><span>SAR {total.toLocaleString()}</span></div>
                    <div className="flex justify-between font-bold text-slate-900 text-base"><span>Total</span><span className="text-teal-600">SAR {total.toLocaleString()}</span></div>
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
