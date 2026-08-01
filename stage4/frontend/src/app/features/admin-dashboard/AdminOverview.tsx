import {
  AlertCircle,
  Building2,
  ChevronRight,
  Star,
  TrendingUp,
  UserRound,
  Waves,
} from "lucide-react";
import type { BookingCard } from "../bookings";
import type {
  AdminDashboardSummary,
  AdminInstructor,
} from "./adminService";
import type { AdminTab, CenterRow } from "./useAdminDashboard";

const ADMIN_CITIES = [
  "Jeddah",
  "Yanbu",
  "Dammam",
  "Khobar",
  "NEOM",
  "Jazan",
];

type AdminOverviewProps = {
  bookings: BookingCard[];
  centers: CenterRow[];
  dashboard: AdminDashboardSummary | null;
  pendingCount: number;
  pendingInstructorCount: number;
  instructors: AdminInstructor[];
  totalRevenue: number;
  onOpenTab: (tab: AdminTab) => void;
};

export function AdminOverview({
  bookings,
  centers,
  dashboard,
  pendingCount,
  pendingInstructorCount,
  instructors,
  totalRevenue,
  onOpenTab,
}: AdminOverviewProps) {
  const activeCenters = centers.filter(
    (center) => center.status === "active",
  ).length;

  const stats = [
    {
      label: "Total Instructors",
      value: dashboard?.totalInstructors ?? instructors.length,
      sub: `${instructors.filter((instructor) => instructor.status === "approved").length} active`,
      icon: <UserRound className="h-5 w-5" />,
      color: "bg-cyan-50 text-cyan-600",
    },
    {
      label: "Total Users",
      value: dashboard?.totalUsers ?? 0,
      sub: "Registered accounts",
      icon: <UserRound className="h-5 w-5" />,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Total Centers",
      value: dashboard?.totalCenters ?? centers.length,
      sub: `${activeCenters} active`,
      icon: <Building2 className="h-5 w-5" />,
      color: "bg-teal-50 text-teal-600",
    },
    {
      label: "Total Bookings",
      value: dashboard?.totalBookings ?? bookings.length,
      sub: `${dashboard?.confirmedBookings ?? 0} confirmed`,
      icon: <Waves className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Reviews",
      value: dashboard?.totalReviews ?? 0,
      sub: "Platform reviews",
      icon: <Star className="h-5 w-5" />,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Platform Revenue",
      value: `SAR ${(
        (dashboard?.totalRevenue ?? totalRevenue) * 0.08
      ).toLocaleString()}`,
      sub: "8% commission",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Pending Approval",
      value: pendingCount + pendingInstructorCount,
      sub: "Require review",
      icon: <AlertCircle className="h-5 w-5" />,
      color:
        pendingCount + pendingInstructorCount > 0
          ? "bg-amber-50 text-amber-600"
          : "bg-slate-100 text-slate-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-7">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-100 bg-white p-5"
          >
            <div
              className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${stat.color}`}
            >
              {stat.icon}
            </div>
            <p className="font-display text-2xl font-bold text-slate-900">
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs font-medium text-slate-600">
              {stat.label}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      {pendingCount > 0 && (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                {pendingCount} center{pendingCount > 1 ? "s" : ""} awaiting
                approval
              </p>
              <p className="mt-0.5 text-xs text-amber-700">
                New dive centers have registered and need verification before
                going live.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenTab("centers")}
            className="flex items-center gap-1 whitespace-nowrap rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
          >
            Review <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {pendingInstructorCount > 0 && (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <UserRound className="h-5 w-5 flex-shrink-0 text-cyan-700" />
            <div>
              <p className="text-sm font-semibold text-cyan-950">
                {pendingInstructorCount} instructor
                {pendingInstructorCount > 1 ? "s" : ""} awaiting approval
              </p>
              <p className="mt-0.5 text-xs text-cyan-800">
                Review instructor licenses before granting access to publish
                trips and courses.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenTab("instructors")}
            className="flex items-center gap-1 whitespace-nowrap rounded-xl bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-800"
          >
            Review <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <div>
        <h2 className="font-display mb-4 text-2xl font-bold tracking-wide text-slate-900">
          CENTERS BY CITY
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {ADMIN_CITIES.map((city) => {
            const cityCenters = centers.filter(
              (center) => center.city === city,
            );
            const active = cityCenters.filter(
              (center) => center.status === "active",
            ).length;

            return (
              <div
                key={city}
                className="rounded-2xl border border-slate-100 bg-white p-4 text-center"
              >
                <p className="font-display text-3xl font-bold text-teal-600">
                  {cityCenters.length}
                </p>
                <p className="mt-0.5 text-sm font-medium text-slate-700">
                  {city}
                </p>
                <p className="text-xs text-slate-400">{active} active</p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">
            RECENT BOOKINGS
          </h2>
          <button
            onClick={() => onOpenTab("bookings")}
            className="text-sm text-teal-600 hover:text-teal-800"
          >
            View all →
          </button>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
          <table className="min-w-[720px] w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                {["ID", "Center", "Trip", "Customer", "Divers", "Total"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.slice(0, 5).map((booking) => (
                <tr
                  key={booking.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-mono text-xs text-teal-600">
                    {booking.reference}
                  </td>
                  <td className="max-w-[160px] truncate px-4 py-3 text-slate-700">
                    {booking.centerName}
                  </td>
                  <td className="max-w-[160px] truncate px-4 py-3 text-slate-600">
                    {booking.title}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {booking.customer}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {booking.divers}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    SAR {booking.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
