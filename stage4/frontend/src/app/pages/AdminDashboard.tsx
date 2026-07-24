import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  ADMIN_TABS,
  AdminBookings,
  AdminCenters,
  AdminOverview,
  AdminProfilePanel,
  AdminReviews,
  useAdminDashboard,
} from "../features/admin-dashboard";
import { useAuth } from "../hooks/useAuth";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const {
    activeTab,
    bookings,
    cancelAdminBooking,
    centerQuery,
    centers,
    dashboard,
    filteredCenters,
    isSavingProfile,
    pendingCount,
    profile,
    profileError,
    removeReview,
    reviews,
    saveProfile,
    setActiveTab,
    setCenterQuery,
    setStatusFilter,
    statusFilter,
    suspendCenter,
    toast,
    totalRevenue,
    verifyCenter,
  } = useAdminDashboard(token);

  return (
    <div className="min-h-screen bg-slate-50">
      {toast && (
        <div className="fixed left-4 right-4 top-20 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl sm:left-auto sm:right-6">
          <CheckCircle className="h-4 w-4 text-teal-400" /> {toast}
        </div>
      )}

      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-red-500">
              Admin Access
            </p>
            <h1 className="font-display text-3xl font-bold tracking-wide text-slate-900">
              ADMIN DASHBOARD
            </h1>
            <p className="mt-0.5 text-sm text-slate-400">
              Oyster Platform Management
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-500 transition-colors hover:text-slate-800"
          >
            ← Back to Site
          </button>
        </div>

        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              {tab.label}
              {tab.key === "centers" && pendingCount > 0
                ? ` (${pendingCount})`
                : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {activeTab === "overview" && (
          <AdminOverview
            bookings={bookings}
            centers={centers}
            dashboard={dashboard}
            pendingCount={pendingCount}
            totalRevenue={totalRevenue}
            onOpenTab={setActiveTab}
          />
        )}

        {activeTab === "centers" && (
          <AdminCenters
            centers={centers}
            filteredCenters={filteredCenters}
            query={centerQuery}
            statusFilter={statusFilter}
            onQueryChange={setCenterQuery}
            onStatusChange={setStatusFilter}
            onVerify={verifyCenter}
            onSuspend={suspendCenter}
            onView={(id) => navigate(`/centers/${id}`)}
          />
        )}

        {activeTab === "bookings" && (
          <AdminBookings
            bookings={bookings}
            totalRevenue={totalRevenue}
            onCancel={cancelAdminBooking}
          />
        )}

        {activeTab === "reviews" && (
          <AdminReviews
            centers={centers}
            reviews={reviews}
            onRemove={removeReview}
            onViewCenter={(id) => navigate(`/centers/${id}`)}
          />
        )}

        {activeTab === "profile" && (
          <AdminProfilePanel
            profile={profile}
            error={profileError}
            isSaving={isSavingProfile}
            onSave={saveProfile}
          />
        )}
      </div>
    </div>
  );
}
