import type { InstructorBookingRow } from "./useInstructorDashboard";

type InstructorBookingsTableProps = {
  bookings: InstructorBookingRow[];
};

export function InstructorBookingsTable({
  bookings,
}: InstructorBookingsTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
      <table className="min-w-[900px] w-full text-sm">
        <thead className="border-b border-slate-100 bg-slate-50">
          <tr>
            {[
              "Booking ID",
              "Trip / Course",
              "Customer",
              "Divers",
              "Total",
              "Date",
              "Status",
            ].map((heading) => (
              <th
                key={heading}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {bookings.map((booking) => (
            <tr key={booking.id} className="transition-colors hover:bg-slate-50">
              <td className="px-4 py-3 font-mono text-xs text-teal-600">
                {booking.id}
              </td>
              <td className="max-w-[180px] truncate px-4 py-3 font-medium text-slate-800">
                {booking.trip}
              </td>
              <td className="px-4 py-3 text-slate-600">{booking.customer}</td>
              <td className="px-4 py-3 text-slate-600">{booking.divers}</td>
              <td className="px-4 py-3 font-semibold text-slate-800">
                SAR {booking.total.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-slate-500">{booking.date}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    booking.status === "confirmed"
                      ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border border-amber-100 bg-amber-50 text-amber-700"
                  }`}
                >
                  {booking.status}
                </span>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">
                No bookings for your trips or courses yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
