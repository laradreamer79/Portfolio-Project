import { Mail, Search, Shield, ShieldOff, UserRound } from "lucide-react";
import type { AdminInstructor } from "./adminService";
import type { InstructorStatus } from "./useAdminDashboard";

type AdminInstructorsProps = {
  instructors: AdminInstructor[];
  filteredInstructors: AdminInstructor[];
  query: string;
  statusFilter: InstructorStatus | "all";
  onQueryChange: (query: string) => void;
  onStatusChange: (status: InstructorStatus | "all") => void;
  onStatusUpdate: (id: number, status: InstructorStatus) => void;
};

export function AdminInstructors({
  instructors,
  filteredInstructors,
  query,
  statusFilter,
  onQueryChange,
  onStatusChange,
  onStatusUpdate,
}: AdminInstructorsProps) {
  const statuses: Array<InstructorStatus | "all"> = [
    "all",
    "approved",
    "pending",
    "rejected",
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 sm:min-w-64">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
            placeholder="Search instructors..."
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
                (
                {
                  instructors.filter(
                    (instructor) => instructor.status === status,
                  ).length
                }
                )
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
        <table className="min-w-[980px] w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>
              {[
                "Instructor",
                "Contact",
                "City",
                "License",
                "Registered",
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
            {filteredInstructors.map((instructor) => (
              <tr
                key={instructor.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                      <UserRound className="h-4 w-4" />
                    </div>
                    <p className="font-semibold text-slate-800">
                      {instructor.user.name}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <a
                    href={`mailto:${instructor.user.email}`}
                    className="flex items-center gap-1 text-slate-600 hover:text-teal-700"
                  >
                    <Mail className="h-3.5 w-3.5" /> {instructor.user.email}
                  </a>
                  <p className="mt-1 text-xs text-slate-400">
                    {instructor.user.phone}
                  </p>
                </td>
                <td className="px-4 py-3.5 text-slate-600">
                  {instructor.city ?? "Not provided"}
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-slate-600">
                  {instructor.licenseNumber}
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500">
                  {new Date(instructor.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      instructor.status === "approved"
                        ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                        : instructor.status === "pending"
                          ? "border-amber-100 bg-amber-50 text-amber-700"
                          : "border-red-100 bg-red-50 text-red-600"
                    }`}
                  >
                    {instructor.status}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    {instructor.status !== "approved" && (
                      <button
                        onClick={() => {
                          if (window.confirm("Approve this instructor account?")) {
                            onStatusUpdate(instructor.id, "approved");
                          }
                        }}
                        className="flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-100"
                      >
                        <Shield className="h-3.5 w-3.5" /> Approve
                      </button>
                    )}
                    {instructor.status !== "rejected" && (
                      <button
                        onClick={() => {
                          if (window.confirm("Reject this instructor account?")) {
                            onStatusUpdate(instructor.id, "rejected");
                          }
                        }}
                        className="flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                      >
                        <ShieldOff className="h-3.5 w-3.5" /> Reject
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredInstructors.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-slate-400">
            No instructors match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
