import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Waves, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyBookings, cancelBooking, type ApiBooking } from "../lib/bookingsService";
import { ApiError } from "../lib/apiClient";
import { useAuth } from "../hooks/useAuth";

const fallbackImage =
  "https://images.unsplash.com/photo-1682687982298-c7514a167088?w=700&h=480&fit=crop&auto=format";

function formatDate(value?: string) {
  if (!value) return "Date TBA";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(value),
  );
}

export function UserDashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    getMyBookings(token)
      .then((data) => {
        if (active) setBookings(data);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load your bookings.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  async function handleCancel(bookingId: number) {
    if (!token || cancellingId) return; // prevent duplicate cancel clicks

    setCancellingId(bookingId);
    setCancelError(null);

    try {
      const updated = await cancelBooking(bookingId, token);
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
    } catch (err) {
      setCancelError(
        err instanceof ApiError ? err.message : "Unable to cancel this booking. Please try again.",
      );
    } finally {
      setCancellingId(null);
    }
  }

  const upcoming = bookings.filter((b) => b.status !== "cancelled");
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-teal-600">My account</p>
          <h1 className="font-display text-5xl font-bold tracking-wide text-slate-900">MY BOOKINGS</h1>
          <p className="mt-2 text-sm text-slate-500">Review your upcoming and previous diving experiences.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total bookings", value: bookings.length },
            { label: "Active", value: upcoming.length },
            { label: "Cancelled", value: cancelled.length },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-100 bg-white p-5">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {cancelError && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {cancelError}
          </div>
        )}

        {loading && <p className="text-sm text-slate-400">Loading your bookings...</p>}

        {!loading && bookings.length === 0 && !error && (
          <div className="rounded-2xl border border-slate-100 bg-white py-16 text-center text-slate-400">
            <Waves className="mx-auto mb-3 h-10 w-10 opacity-30" />
            You haven't booked any trips or courses yet.
            <div className="mt-4">
              <button
                onClick={() => navigate("/trips")}
                className="rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-600 transition-colors"
              >
                Browse Trips
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {!loading &&
            bookings.map((booking) => {
              const isCourse = Boolean(booking.course);
              const item = booking.trip ?? booking.course;
              if (!item) return null;

              const center = item.center;
              const dateValue = "scheduleDate" in item ? item.scheduleDate : item.startDate;
              const reference = `OYS-${String(booking.id).padStart(6, "0")}`;

              return (
                <article key={booking.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white md:flex">
                  <img
                    src={item.imageUrl ?? fallbackImage}
                    alt={item.title}
                    className="h-48 w-full object-cover md:h-auto md:w-64"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{reference}</p>
                        <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">{item.title}</h2>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          booking.status === "confirmed"
                            ? "bg-emerald-50 text-emerald-700"
                            : booking.status === "pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="mb-5 flex flex-wrap gap-4 text-sm text-slate-500">
                      {center && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-teal-500" />
                          {center.name} · {center.city}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-slate-300" />
                        {formatDate(dateValue)}
                      </span>
                      {!isCourse && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-slate-300" />
                          {(booking.trip as { durationHours: number }).durationHours} hours
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Waves className="h-4 w-4 text-slate-300" />
                        {booking.numberOfPeople} diver{booking.numberOfPeople > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <p className="font-semibold text-slate-800">
                        SAR {Number(booking.totalPrice).toLocaleString()}
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(isCourse ? `/courses/${item.id}` : `/trips/${item.id}`)}
                          className="rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-600"
                        >
                          View details
                        </button>
                        {booking.status !== "cancelled" && (
                          <button
                            type="button"
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="flex items-center gap-1 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40"
                          >
                            <X className="h-3.5 w-3.5" />
                            {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      </div>
    </div>
  );
}
