import { Calendar, Clock, MapPin, Waves } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CENTERS, TRIPS } from "../data";

const BOOKINGS = [
  { reference: "OYS-A8X2K1", tripId: 1, divers: 2, total: 640, status: "confirmed" },
  { reference: "OYS-B3Y9L4", tripId: 4, divers: 1, total: 450, status: "pending" },
  { reference: "OYS-C7Z0M5", tripId: 13, divers: 1, total: 1800, status: "completed" },
] as const;

export function UserDashboard() {
  const navigate = useNavigate();

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
            { label: "Total bookings", value: BOOKINGS.length },
            { label: "Upcoming", value: BOOKINGS.filter((booking) => booking.status !== "completed").length },
            { label: "Completed", value: BOOKINGS.filter((booking) => booking.status === "completed").length },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-100 bg-white p-5">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {BOOKINGS.map((booking) => {
            const trip = TRIPS.find((candidate) => candidate.id === booking.tripId);
            const center = trip ? CENTERS.find((candidate) => candidate.id === trip.centerId) : undefined;

            if (!trip || !center) return null;

            return (
              <article key={booking.reference} className="overflow-hidden rounded-2xl border border-slate-100 bg-white md:flex">
                <img src={trip.img} alt={trip.title} className="h-48 w-full object-cover md:h-auto md:w-64" />
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{booking.reference}</p>
                      <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">{trip.title}</h2>
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
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-teal-500" />{center.name} · {center.city}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-slate-300" />{trip.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-slate-300" />{trip.duration}</span>
                    <span className="flex items-center gap-1"><Waves className="h-4 w-4 text-slate-300" />{booking.divers} diver{booking.divers > 1 ? "s" : ""}</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                    <p className="font-semibold text-slate-800">SAR {booking.total.toLocaleString()}</p>
                    <button
                      type="button"
                      onClick={() => navigate(trip.type === "course" ? `/courses/${trip.id}` : `/trips/${trip.id}`)}
                      className="rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-600"
                    >
                      View details
                    </button>
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
