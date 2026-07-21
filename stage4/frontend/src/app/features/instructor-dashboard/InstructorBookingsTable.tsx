import { CheckCircle } from "lucide-react";
import type { InstructorBookingRow } from "./useInstructorDashboard";

type InstructorBookingsTableProps = {
  bookings: InstructorBookingRow[];
  onConfirm: (id: string) => void;
  onDecline?: (id: string) => void;
};

export function InstructorBookingsTable({
  bookings,
  onConfirm,
  onDecline,
}: InstructorBookingsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <table className="w-full text-sm">
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
              "Action",
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
              <td className="px-4 py-3">
                {booking.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onConfirm(booking.id)}
                      className="flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-100"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Confirm
                    </button>
                    {onDecline && (
                      <button
                        type="button"
                        onClick={() => onDecline(booking.id)}
                        className="rounded-lg border border-red-100 bg-red-50 px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                      >
                        Decline
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
