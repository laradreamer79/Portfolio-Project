import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Calendar,
  ChevronLeft,
  Clock,
  MapPin,
  Users,
  Waves,
  X,
} from "lucide-react";
import { getMyBookings, cancelBooking, type ApiBooking } from "../lib/bookingsService";
import { ApiError } from "../lib/apiClient";
import { useAuth } from "../hooks/useAuth";

const fallbackImage =
  "https://images.unsplash.com/photo-1682687982298-c7514a167088?w=700&h=480&fit=crop&auto=format";

function formatDate(value?: string) {
  if (!value) return "Date TBA";
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(
    new Date(value),
  );
}

const statusStyles: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  pending: "bg-amber-50 text-amber-700 border border-amber-100",
  cancelled: "bg-slate-100 text-slate-600 border border-slate-200",
};

export function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [booking, setBooking] = useState<ApiBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const bookingId = Number(id);

  useEffect(() => {
    if (!token || !Number.isInteger(bookingId)) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    getMyBookings(token)
      .then((all) => {
        if (!active) return;
        const found = all.find((b) => b.id === bookingId);
        setBooking(found ?? null);
        if (!found) setError("Booking not found.");
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Unable to load this booking.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, bookingId]);

  async function handleCancel() {
    if (!token || !booking || isCancelling) return;
    setIsCancelling(true);
    setCancelError(null);
    try {
      const updated = await cancelBooking(booking.id, token);
      setBooking(updated);
    } catch (err) {
      setCancelError(err instanceof ApiError ? err.message : "Unable to cancel this booking.");
    } finally {
      setIsCancelling(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96 text-slate-400">Loading booking...</div>;
  }

  if (error || !booking) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-slate-400">{error ?? "Booking not found."}</p>
        <button onClick={() => navigate("/dashboard")} className="text-teal-600 text-sm font-medium">
          ← Back to My Bookings
        </button>
      </div>
    );
  }

  const isCourse = Boolean(booking.course);
  const item = booking.trip ?? booking.course;
  if (!item) {
    return <div className="flex items-center justify-center h-96 text-slate-400">This listing is no longer available.</div>;
  }

  const center = item.center;
  const dateValue = "scheduleDate" in item ? item.scheduleDate : item.startDate;
  const reference = `OYS-${String(booking.id).padStart(6, "0")}`;
  const pricePerPerson = booking.numberOfPeople > 0 ? Number(booking.totalPrice) / booking.numberOfPeople : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to My Bookings
        </button>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="h-56 overflow-hidden bg-slate-200">
            <img src={item.imageUrl ?? fallbackImage} alt={item.title} className="w-full h-full object-cover" />
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                  Booking Reference
                </p>
                <p className="font-mono font-bold text-teal-600 text-lg">{reference}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${statusStyles[booking.status]}`}
              >
                {booking.status}
              </span>
            </div>

            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-2 inline-block ${isCourse ? "bg-purple-50 text-purple-700" : "bg-teal-50 text-teal-700"}`}
            >
              {isCourse ? "Course" : "Trip"}
            </span>
            <h1 className="font-display text-3xl font-bold text-slate-900 tracking-wide mb-1">{item.title}</h1>
            {center && (
              <p className="text-slate-500 text-sm flex items-center gap-1 mb-6">
                <MapPin className="w-4 h-4 text-teal-500" />
                {center.name} · {center.city}
              </p>
            )}

            {cancelError && (
              <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {cancelError}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <div className="flex justify-center text-teal-500 mb-2"><Calendar className="w-5 h-5" /></div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">Date</p>
                <p className="text-sm font-semibold text-slate-800">{formatDate(dateValue)}</p>
              </div>
              {!isCourse && booking.trip && (
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <div className="flex justify-center text-teal-500 mb-2"><Clock className="w-5 h-5" /></div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">Duration</p>
                  <p className="text-sm font-semibold text-slate-800">{booking.trip.durationHours} hours</p>
                </div>
              )}
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <div className="flex justify-center text-teal-500 mb-2"><Users className="w-5 h-5" /></div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">Divers</p>
                <p className="text-sm font-semibold text-slate-800">{booking.numberOfPeople}</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <div className="flex justify-center text-teal-500 mb-2"><Waves className="w-5 h-5" /></div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">Booked on</p>
                <p className="text-sm font-semibold text-slate-800">{formatDate(booking.createdAt)}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-2 mb-6">
              <div className="flex justify-between text-sm text-slate-500">
                <span>SAR {pricePerPerson.toLocaleString()} × {booking.numberOfPeople} diver{booking.numberOfPeople > 1 ? "s" : ""}</span>
                <span>SAR {Number(booking.totalPrice).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-200">
                <span>Total Paid</span>
                <span className="text-teal-600">SAR {Number(booking.totalPrice).toLocaleString()}</span>
              </div>
            </div>

            {booking.status === "cancelled" ? (
              <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                This booking has been cancelled.
              </div>
            ) : (
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40"
              >
                <X className="w-3.5 h-3.5" />
                {isCancelling ? "Cancelling..." : "Cancel Booking"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
