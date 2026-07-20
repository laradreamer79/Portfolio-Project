import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Center } from "../data";
import { getCenters } from "../features/catalog";
import { getAllBookings, type BookingCard } from "../lib/bookingService";
import { useAuth } from "../hooks/useAuth";
import {
  Building2, Waves, Star, TrendingUp, CheckCircle,
  X, Search, Shield, ShieldOff, Eye, ChevronRight, AlertCircle,
} from "lucide-react";

type CenterRow = Center & { status: "active" | "pending" | "suspended" };

type ReviewRow = {
  id: number;
  centerId: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "centers" | "bookings" | "reviews">("overview");
  const [centers, setCenters] = useState<CenterRow[]>([]);
  const [bookings, setBookings] = useState<BookingCard[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [centerQuery, setCenterQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let active = true;

    getCenters({ status: "all" }, token)
      .then((data) => {
        if (!active) return;
        setCenters(data.map((center) => ({
          ...center,
          status: center.verified ? "active" : "pending",
        })));
      })
      .catch(() => {
        if (active) setCenters([]);
      });

    getAllBookings(token)
      .then((data) => {
        if (active) setBookings(data);
      })
      .catch(() => {
        if (active) setBookings([]);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const verifyCenter = (id: number) => {
    setCenters((prev) => prev.map((c) => c.id === id ? { ...c, status: "active", verified: true } : c));
    showToast("Center verified and activated.");
  };
  const suspendCenter = (id: number) => {
    setCenters((prev) => prev.map((c) => c.id === id ? { ...c, status: "suspended" } : c));
    showToast("Center suspended.");
  };
  const removeReview = (id: number) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast("Review removed.");
  };

  const filteredCenters = centers.filter((c) => {
    const matchQ = !centerQuery || c.name.toLowerCase().includes(centerQuery.toLowerCase()) || c.city.toLowerCase().includes(centerQuery.toLowerCase());
    const matchS = statusFilter === "all" || c.status === statusFilter;
    return matchQ && matchS;
  });

  const totalRevenue = bookings.reduce((s, b) => s + b.total, 0);
  const pendingCount = centers.filter((c) => c.status === "pending").length;

  const TABS = [
    { key: "overview", label: "Overview" },
    { key: "centers", label: `Centers${pendingCount ? ` (${pendingCount})` : ""}` },
    { key: "bookings", label: "Bookings" },
    { key: "reviews", label: "Reviews" },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-teal-400" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <p className="text-red-500 text-xs font-semibold tracking-widest uppercase mb-1">Admin Access</p>
            <h1 className="font-display text-3xl font-bold text-slate-900 tracking-wide">ADMIN DASHBOARD</h1>
            <p className="text-slate-400 text-sm mt-0.5">Oyster Platform Management</p>
          </div>
          <button onClick={() => navigate("/")} className="text-sm text-slate-500 hover:text-slate-800 border border-slate-200 px-4 py-2 rounded-xl transition-colors">
            ← Back to Site
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === t.key ? "border-teal-500 text-teal-600" : "border-transparent text-slate-400 hover:text-slate-700"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { label: "Total Centers", value: centers.length, sub: `${centers.filter((c) => c.status === "active").length} active`, icon: <Building2 className="w-5 h-5" />, color: "teal" },
                { label: "Total Bookings", value: bookings.length, sub: "This month", icon: <Waves className="w-5 h-5" />, color: "blue" },
                { label: "Platform Revenue", value: `SAR ${(totalRevenue * 0.08).toLocaleString()}`, sub: "8% commission", icon: <TrendingUp className="w-5 h-5" />, color: "emerald" },
                { label: "Pending Approval", value: pendingCount, sub: "Require review", icon: <AlertCircle className="w-5 h-5" />, color: pendingCount > 0 ? "amber" : "slate" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                  <div className={`w-9 h-9 rounded-xl mb-3 flex items-center justify-center ${
                    s.color === "teal" ? "bg-teal-50 text-teal-600" :
                    s.color === "blue" ? "bg-blue-50 text-blue-600" :
                    s.color === "emerald" ? "bg-emerald-50 text-emerald-600" :
                    s.color === "amber" ? "bg-amber-50 text-amber-600" :
                    "bg-slate-100 text-slate-500"
                  }`}>
                    {s.icon}
                  </div>
                  <p className="font-display text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs font-medium text-slate-600 mt-0.5">{s.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Pending centers alert */}
            {pendingCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-900 text-sm">{pendingCount} center{pendingCount > 1 ? "s" : ""} awaiting approval</p>
                    <p className="text-amber-700 text-xs mt-0.5">New dive centers have registered and need verification before going live.</p>
                  </div>
                </div>
                <button onClick={() => setActiveTab("centers")} className="bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-amber-700 transition-colors whitespace-nowrap flex items-center gap-1">
                  Review <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* City breakdown */}
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide mb-4">CENTERS BY CITY</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {["Jeddah", "Yanbu", "Dammam", "Al Khobar", "NEOM", "Jizan"].map((city) => {
                  const count = centers.filter((c) => c.city === city).length;
                  const active = centers.filter((c) => c.city === city && c.status === "active").length;
                  return (
                    <div key={city} className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
                      <p className="font-display text-3xl font-bold text-teal-600">{count}</p>
                      <p className="text-sm font-medium text-slate-700 mt-0.5">{city}</p>
                      <p className="text-xs text-slate-400">{active} active</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent bookings snapshot */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide">RECENT BOOKINGS</h2>
                <button onClick={() => setActiveTab("bookings")} className="text-sm text-teal-600 hover:text-teal-800">View all →</button>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {["ID", "Center", "Trip", "Customer", "Divers", "Total"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-teal-600">{b.reference}</td>
                        <td className="px-4 py-3 text-slate-700 max-w-[160px] truncate">{b.centerName}</td>
                        <td className="px-4 py-3 text-slate-600 max-w-[160px] truncate">{b.title}</td>
                        <td className="px-4 py-3 text-slate-600">{b.customer}</td>
                        <td className="px-4 py-3 text-slate-500">{b.divers}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">SAR {b.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Centers ── */}
        {activeTab === "centers" && (
          <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex items-center gap-2 flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
                <Search className="w-4 h-4 text-slate-400" />
                <input className="flex-1 text-sm text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent" placeholder="Search centers..." value={centerQuery} onChange={(e) => setCenterQuery(e.target.value)} />
              </div>
              {(["all", "active", "pending", "suspended"] as const).map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors border ${statusFilter === s ? "bg-teal-500 text-white border-teal-500" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                  {s} {s !== "all" && <span className="ml-1 opacity-70">({centers.filter((c) => c.status === s).length})</span>}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {["Center", "City", "Rating", "Reviews", "Price Range", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCenters.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                            <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{c.name}</p>
                            {c.verified && <span className="text-xs text-teal-600 flex items-center gap-0.5"><Shield className="w-3 h-3" /> Verified</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{c.city}</td>
                      <td className="px-4 py-3.5">
                        <span className="flex items-center gap-1 text-slate-700">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {c.rating}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500">{c.reviews}</td>
                      <td className="px-4 py-3.5 text-slate-500 text-xs">{c.priceRange}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          c.status === "active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                          c.status === "pending" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                          "bg-red-50 text-red-600 border border-red-100"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => navigate(`/centers/${c.id}`)} className="p-1.5 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-teal-50 transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          {c.status === "pending" && (
                            <button onClick={() => verifyCenter(c.id)} className="flex items-center gap-1 text-xs bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1.5 rounded-lg hover:bg-teal-100 transition-colors font-medium">
                              <Shield className="w-3.5 h-3.5" /> Approve
                            </button>
                          )}
                          {c.status === "active" && (
                            <button onClick={() => suspendCenter(c.id)} className="flex items-center gap-1 text-xs bg-red-50 text-red-600 border border-red-100 px-2.5 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium">
                              <ShieldOff className="w-3.5 h-3.5" /> Suspend
                            </button>
                          )}
                          {c.status === "suspended" && (
                            <button onClick={() => verifyCenter(c.id)} className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors font-medium">
                              <CheckCircle className="w-3.5 h-3.5" /> Reinstate
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
        )}

        {/* ── Bookings ── */}
        {activeTab === "bookings" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide">ALL BOOKINGS</h2>
              <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-600">
                Total: <span className="font-bold text-slate-900">SAR {totalRevenue.toLocaleString()}</span>
                <span className="text-slate-400 ml-2">· Commission: SAR {(totalRevenue * 0.08).toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {["Booking ID", "Center", "City", "Trip", "Customer", "Divers", "Total", "Date"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-xs text-teal-600">{b.reference}</td>
                      <td className="px-4 py-3.5 font-medium text-slate-800 max-w-[140px] truncate">{b.centerName}</td>
                      <td className="px-4 py-3.5 text-slate-500 text-xs">{b.city}</td>
                      <td className="px-4 py-3.5 text-slate-600 max-w-[150px] truncate">{b.title}</td>
                      <td className="px-4 py-3.5 text-slate-700">{b.customer}</td>
                      <td className="px-4 py-3.5 text-slate-500">{b.divers}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">SAR {b.total.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-slate-500">{b.date}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-100">
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-widest">Platform Total</td>
                    <td className="px-4 py-3 font-bold text-slate-900">SAR {totalRevenue.toLocaleString()}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* ── Reviews ── */}
        {activeTab === "reviews" && (
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide mb-6">ALL REVIEWS</h2>
            <div className="space-y-4">
              {reviews.map((r) => {
                const center = centers.find((c) => c.id === r.centerId);
                const isSpam = r.rating <= 2;
                return (
                  <div key={r.id} className={`bg-white rounded-2xl border p-5 flex gap-4 ${isSpam ? "border-red-200 bg-red-50" : "border-slate-100"}`}>
                    <img src={r.avatar} alt={r.user} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-slate-900 text-sm">{r.user}</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                          ))}
                        </div>
                        {center && (
                          <button onClick={() => navigate(`/centers/${center.id}`)} className="text-xs text-teal-600 hover:text-teal-800 font-medium flex items-center gap-0.5">
                            {center.name} <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                        <span className="text-xs text-slate-400">{r.date}</span>
                        {isSpam && (
                          <span className="text-xs bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Flagged
                          </span>
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed ${isSpam ? "text-red-700" : "text-slate-600"}`}>{r.comment}</p>
                    </div>
                    <button onClick={() => removeReview(r.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0 self-start" title="Remove review">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
              {reviews.length === 0 && (
                <div className="text-center py-20 text-slate-400">
                  <Star className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  No reviews on the platform yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
