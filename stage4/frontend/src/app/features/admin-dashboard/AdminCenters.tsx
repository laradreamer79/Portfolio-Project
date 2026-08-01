import {
  CheckCircle,
  Eye,
  Search,
  Shield,
  ShieldOff,
  Star,
} from "lucide-react";
import type {
  CenterRow,
  CenterStatus,
} from "./useAdminDashboard";

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
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 sm:min-w-64">
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

      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
        <table className="min-w-[900px] w-full text-sm">
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
