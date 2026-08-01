import type { BookingCard } from "../bookings";

type AdminBookingsProps = {
  bookings: BookingCard[];
  totalRevenue: number;
  onCancel: (id: number) => void;
};

export function AdminBookings({
  bookings,
  totalRevenue,
  onCancel,
}: AdminBookingsProps) {
  return (
    <div>
      <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">
          ALL BOOKINGS
        </h2>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
          Total:{" "}
          <span className="font-bold text-slate-900">
            SAR {totalRevenue.toLocaleString()}
          </span>
          <span className="ml-2 text-slate-400">
            · Commission: SAR {(totalRevenue * 0.08).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>
              {[
                "Booking ID",
                "Center",
                "City",
                "Trip",
                "Customer",
                "Divers",
                "Total",
                "Date",
                "Status",
                "Actions",
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
              <tr
                key={booking.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-3.5 font-mono text-xs text-teal-600">
                  {booking.reference}
                </td>
                <td className="max-w-[140px] truncate px-4 py-3.5 font-medium text-slate-800">
                  {booking.centerName}
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500">
                  {booking.city}
                </td>
                <td className="max-w-[150px] truncate px-4 py-3.5 text-slate-600">
                  {booking.title}
                </td>
                <td className="px-4 py-3.5 text-slate-700">
                  {booking.customer}
                </td>
                <td className="px-4 py-3.5 text-slate-500">
                  {booking.divers}
                </td>
                <td className="px-4 py-3.5 font-semibold text-slate-800">
                  SAR {booking.total.toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-slate-500">
                  {booking.date}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
                      booking.status === "confirmed"
                        ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                        : booking.status === "cancelled"
                          ? "border-red-100 bg-red-50 text-red-600"
                          : "border-amber-100 bg-amber-50 text-amber-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  {booking.status !== "cancelled" && (
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to cancel this booking?",
                          )
                        ) {
                          onCancel(booking.id);
                        }
                      }}
                      className="rounded-lg border border-red-100 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-slate-100 bg-slate-50">
            <tr>
              <td
                colSpan={6}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400"
              >
                Platform Total
              </td>
              <td className="px-4 py-3 font-bold text-slate-900">
                SAR {totalRevenue.toLocaleString()}
              </td>
              <td colSpan={3} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
