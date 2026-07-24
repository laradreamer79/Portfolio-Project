import { useEffect, useState, type FormEvent } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  ChevronRight,
  Eye,
  Mail,
  Save,
  Search,
  Shield,
  ShieldOff,
  Star,
  TrendingUp,
  UserRound,
  Waves,
  X,
} from "lucide-react";
import type { BookingCard } from "../bookings";
import type {
  AdminDashboardSummary,
  AdminProfile,
} from "./adminService";
import type { UpdateAdminProfileInput } from "./adminValidation";
import type {
  AdminTab,
  CenterRow,
  CenterStatus,
  ReviewRow,
} from "./useAdminDashboard";

const ADMIN_CITIES = [
  "Jeddah",
  "Yanbu",
  "Dammam",
  "Al Khobar",
  "NEOM",
  "Jazan",
];

type AdminOverviewProps = {
  bookings: BookingCard[];
  centers: CenterRow[];
  dashboard: AdminDashboardSummary | null;
  pendingCount: number;
  totalRevenue: number;
  onOpenTab: (tab: AdminTab) => void;
};

export function AdminOverview({
  bookings,
  centers,
  dashboard,
  pendingCount,
  totalRevenue,
  onOpenTab,
}: AdminOverviewProps) {
  const activeCenters = centers.filter(
    (center) => center.status === "active",
  ).length;

  const stats = [
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
      value: pendingCount,
      sub: "Require review",
      icon: <AlertCircle className="h-5 w-5" />,
      color:
        pendingCount > 0
          ? "bg-amber-50 text-amber-600"
          : "bg-slate-100 text-slate-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-6">
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
        <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-5">
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
        <div className="mb-4 flex items-center justify-between">
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
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <table className="w-full text-sm">
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

type AdminCentersProps = {
  centers: CenterRow[];
  filteredCenters: CenterRow[];
  query: string;
  statusFilter: CenterStatus | "all";
  onQueryChange: (query: string) => void;
  onStatusChange: (status: CenterStatus | "all") => void;
  onVerify: (id: number) => void;
  onSuspend: (id: number) => void;
  onView: (id: number) => void;
};

export function AdminCenters({
  centers,
  filteredCenters,
  query,
  statusFilter,
  onQueryChange,
  onStatusChange,
  onVerify,
  onSuspend,
  onView,
}: AdminCentersProps) {
  const statuses: Array<CenterStatus | "all"> = [
    "all",
    "active",
    "pending",
    "suspended",
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
            placeholder="Search centers..."
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={`rounded-xl border px-4 py-2 text-sm font-medium capitalize transition-colors ${
              statusFilter === status
                ? "border-teal-500 bg-teal-500 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {status}{" "}
            {status !== "all" && (
              <span className="ml-1 opacity-70">
                ({centers.filter((center) => center.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>
              {[
                "Center",
                "City",
                "Rating",
                "Reviews",
                "Price Range",
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
            {filteredCenters.map((center) => (
              <tr
                key={center.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={center.img}
                        alt={center.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {center.name}
                      </p>
                      {center.verified && (
                        <span className="flex items-center gap-0.5 text-xs text-teal-600">
                          <Shield className="h-3 w-3" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-600">{center.city}</td>
                <td className="px-4 py-3.5">
                  <span className="flex items-center gap-1 text-slate-700">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{" "}
                    {center.rating}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-slate-500">
                  {center.reviews}
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500">
                  {center.priceRange}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      center.status === "active"
                        ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                        : center.status === "pending"
                          ? "border-amber-100 bg-amber-50 text-amber-700"
                          : "border-red-100 bg-red-50 text-red-600"
                    }`}
                  >
                    {center.status}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(center.id)}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-teal-50 hover:text-teal-600"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {center.status === "pending" && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to approve this center?",
                            )
                          ) {
                            onVerify(center.id);
                          }
                        }}
                        className="flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-100"
                      >
                        <Shield className="h-3.5 w-3.5" /> Approve
                      </button>
                    )}
                    {center.status === "active" && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to suspend this center?",
                            )
                          ) {
                            onSuspend(center.id);
                          }
                        }}
                        className="flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                      >
                        <ShieldOff className="h-3.5 w-3.5" /> Suspend
                      </button>
                    )}
                    {center.status === "suspended" && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to reinstate this center?",
                            )
                          ) {
                            onVerify(center.id);
                          }
                        }}
                        className="flex items-center gap-1 rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> Reinstate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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
      <div className="mb-6 flex items-center justify-between">
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
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <table className="w-full text-sm">
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

type AdminReviewsProps = {
  centers: CenterRow[];
  reviews: ReviewRow[];
  onRemove: (id: number) => void;
  onViewCenter: (id: number) => void;
};

export function AdminReviews({
  centers,
  reviews,
  onRemove,
  onViewCenter,
}: AdminReviewsProps) {
  return (
    <div>
      <h2 className="font-display mb-6 text-2xl font-bold tracking-wide text-slate-900">
        ALL REVIEWS
      </h2>
      <div className="space-y-4">
        {reviews.map((review) => {
          const center = centers.find(
            (candidate) => candidate.id === review.centerId,
          );
          const isSpam = review.rating <= 2;

          return (
            <div
              key={review.id}
              className={`flex gap-4 rounded-2xl border bg-white p-5 ${
                isSpam ? "border-red-200 bg-red-50" : "border-slate-100"
              }`}
            >
              <img
                src={review.avatar}
                alt={review.user}
                className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white object-cover shadow"
              />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    {review.user}
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Star
                        key={rating}
                        className={`h-3.5 w-3.5 ${
                          rating <= review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  {center && (
                    <button
                      onClick={() => onViewCenter(center.id)}
                      className="flex items-center gap-0.5 text-xs font-medium text-teal-600 hover:text-teal-800"
                    >
                      {center.name} <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                  <span className="text-xs text-slate-400">{review.date}</span>
                  {isSpam && (
                    <span className="flex items-center gap-1 rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                      <AlertCircle className="h-3 w-3" /> Flagged
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm leading-relaxed ${
                    isSpam ? "text-red-700" : "text-slate-600"
                  }`}
                >
                  {review.comment}
                </p>
              </div>
              <button
                onClick={() => onRemove(review.id)}
                className="self-start rounded-xl p-2 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                title="Remove review"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
        {reviews.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            <Star className="mx-auto mb-3 h-10 w-10 opacity-20" />
            No reviews on the platform yet.
          </div>
        )}
      </div>
    </div>
  );
}

type AdminProfilePanelProps = {
  profile: AdminProfile | null;
  error: string | null;
  isSaving: boolean;
  onSave: (data: UpdateAdminProfileInput) => Promise<void>;
};

export function AdminProfilePanel({
  profile,
  error,
  isSaving,
  onSave,
}: AdminProfilePanelProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setEmail(profile.email);
  }, [profile]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSave({ name, email });
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-sm text-slate-500">
        {error ?? "Loading admin profile..."}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">
          ADMIN PROFILE
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Update your account name and email address.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6"
      >
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="admin-name"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Name
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-teal-500">
            <UserRound className="h-4 w-4 text-slate-400" />
            <input
              id="admin-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              className="flex-1 bg-transparent text-sm text-slate-800 outline-none"
              autoComplete="name"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="admin-email"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Email
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-teal-500">
            <Mail className="h-4 w-4 text-slate-400" />
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={254}
              className="flex-1 bg-transparent text-sm text-slate-800 outline-none"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
          Role: <span className="font-semibold capitalize">{profile.role}</span>
          <span className="mx-2">·</span>
          Member since {new Date(profile.createdAt).toLocaleDateString()}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
