import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Calendar,
  ChevronLeft,
  Clock,
  MapPin,
  Users,
  Waves,
} from "lucide-react";
import { useBookingDetail } from "../features/bookings";
import { ReviewForm, useReviewSubmission } from "../features/reviews";
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
  const {
    booking,
    error,
    loading,
  } = useBookingDetail(token, id);
  const reviewTarget = booking?.trip ? "trip" : "course";
  const reviewTargetId = booking?.trip?.id ?? booking?.course?.id ?? 0;
  const handleReviewSubmit = useReviewSubmission({
    token,
    target: reviewTarget,
    targetId: reviewTargetId,
    onCreated: () => undefined,
  });

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
            ) : null}

            {booking.status === "confirmed" && (
              <ReviewForm
                onSubmit={handleReviewSubmit}
                label={item.title}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
