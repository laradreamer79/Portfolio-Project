import { useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, Search, Star } from "lucide-react";
import { CITIES } from "../data";
import { CenterCard, useCentersCatalog } from "../features/catalog";

export function Centers() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const {
    city,
    error,
    filteredCenters: filtered,
    loading,
    minRating,
    query,
    setCity,
    setMinRating,
    setQuery,
  } = useCentersCatalog(
    params.get("city") || "All Cities",
    params.get("search") || "",
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-teal-600 text-sm font-medium tracking-widest uppercase mb-2">Browse</p>
          <h1 className="font-display text-5xl font-bold text-slate-900 tracking-wide mb-6">DIVING CENTERS</h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
              <Search className="w-4 h-4 text-slate-400" />
              <input className="flex-1 text-sm text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent" placeholder="Search centers..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-teal-400" value={city} onChange={(e) => setCity(e.target.value)}>
              {CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-teal-400" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
              <option value={0}>Any Rating</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {city !== "All Cities" && <span className="bg-teal-100 text-teal-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">{city} <button onClick={() => setCity("All Cities")} className="ml-1 hover:text-teal-900">×</button></span>}
          {minRating > 0 && <span className="bg-teal-100 text-teal-700 text-xs px-3 py-1 rounded-full flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> {minRating}+ Stars <button onClick={() => setMinRating(0)} className="ml-1 hover:text-teal-900">×</button></span>}
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <p className="text-sm text-slate-500 mb-6">
          {loading ? "Loading centers..." : <><span className="font-semibold text-slate-900">{filtered.length}</span> centers found{city !== "All Cities" && <span> in <span className="text-teal-600 font-medium">{city}</span></span>}</>}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {!loading && filtered.map((center) => (
            <CenterCard
              key={center.id}
              center={center}
              onSelect={(selectedCenter) => navigate(`/centers/${selectedCenter.id}`)}
            />
          ))}
          {loading && (
            <div className="col-span-3 text-center py-20 text-slate-400">
              Loading diving centers...
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="col-span-3 text-center py-20 text-slate-400">
              <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
              No centers found for your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
