import { Calendar, Clock, GraduationCap, MapPin, Waves } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMyBookings } from "../features/bookings";
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
  const {
    activeCount,
    bookings,
    cancelledCount,
    error,
    loading,
  } = useMyBookings(token);

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
            { label: "Active", value: activeCount },
            { label: "Cancelled", value: cancelledCount },
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

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {!loading &&
            bookings.map((booking) => {
              const isCourse = Boolean(booking.course);
              const item = booking.trip ?? booking.course;
              if (!item) return null;

              const center = item.center;
              const dateValue = "scheduleDate" in item ? item.scheduleDate : item.startDate;
              const reference = `OYS-${String(booking.id).padStart(6, "0")}`;

              return (
                <article key={booking.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <button
                    type="button"
                    onClick={() => navigate(`/${isCourse ? "courses" : "trips"}/${item.id}`)}
                    className="relative h-48 w-full overflow-hidden bg-slate-100 text-left"
                  >
                    <img
                      src={item.imageUrl ?? fallbackImage}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className={`absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white ${isCourse ? "bg-purple-500" : "bg-teal-500"}`}>
                      {isCourse && <GraduationCap className="h-3 w-3" />}
                      {isCourse ? "Course" : "Trip"}
                    </span>
                    <span
                      className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        booking.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-700"
                          : booking.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                    <span className="absolute bottom-3 left-3 text-xs font-medium text-white/85">{reference}</span>
                  </button>

                  <div className="flex flex-1 flex-col p-4">
                    <button
                      type="button"
                      onClick={() => navigate(`/${isCourse ? "courses" : "trips"}/${item.id}`)}
                      className="mb-1 text-left"
                    >
                      <h2 className={`font-display text-xl font-bold leading-tight tracking-wide text-slate-900 transition-colors ${isCourse ? "hover:text-purple-600" : "hover:text-teal-600"}`}>
                        {item.title}
                      </h2>
                    </button>
                    {center && (
                      <p className="mb-3 flex items-center gap-1 text-xs font-medium text-teal-600">
                        <MapPin className="h-3 w-3 text-teal-500" />
                        {center.name} · {center.city}
                      </p>
                    )}

                    <div className="mb-4 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-300" />
                        {formatDate(dateValue)}
                      </span>
                      {!isCourse && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-300" />
                          {(booking.trip as { durationHours: number }).durationHours} hours
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Waves className="h-3.5 w-3.5 text-slate-300" />
                        {booking.numberOfPeople} diver{booking.numberOfPeople > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="mt-auto border-t border-slate-100 pt-3">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs text-slate-400">Total</span>
                        <span className="font-semibold text-slate-800">SAR {Number(booking.totalPrice).toLocaleString()}</span>
                      </div>
                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => navigate(`/${isCourse ? "courses" : "trips"}/${item.id}`)}
                          className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors ${isCourse ? "bg-purple-500 hover:bg-purple-600" : "bg-teal-500 hover:bg-teal-600"}`}
                        >
                          View details
                        </button>
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
