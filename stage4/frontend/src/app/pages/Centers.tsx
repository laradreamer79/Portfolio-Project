import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import { CENTERS, CITIES } from "../data";
import { CenterCard } from "../components/cards/CenterCard";

export function Centers() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [city, setCity] = useState(params.get("city") || "All Cities");
  const [query, setQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    const c = params.get("city");
    if (c) setCity(c);
  }, [params]);

  const filtered = CENTERS.filter((c) => {
    const matchCity = city === "All Cities" || c.city === city;
    const matchQuery = !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.city.toLowerCase().includes(query.toLowerCase());
    const matchRating = c.rating >= minRating;
    const matchVerified = !verifiedOnly || c.verified;
    return matchCity && matchQuery && matchRating && matchVerified;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-teal-600 text-sm font-medium tracking-widest uppercase mb-2">Browse</p>
          <h1 className="font-display text-5xl font-bold text-slate-900 tracking-wide mb-6">DIVING CENTERS</h1>

          {/* Search + filters row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
              <Search className="w-4 h-4 text-slate-400" />
              <input className="flex-1 text-sm text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent" placeholder="Search centers..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-teal-400" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
                <option value={0}>Any Rating</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 cursor-pointer">
                <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="accent-teal-500" />
                Verified only
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* City sidebar */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">City</p>
          <div className="space-y-1">
            {CITIES.map((c) => (
              <button key={c} onClick={() => setCity(c)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${city === c ? "bg-teal-50 text-teal-700 border border-teal-200" : "text-slate-600 hover:bg-slate-100"}`}>
                <span className="flex items-center justify-between">
                  {c}
                  {c !== "All Cities" && <span className="text-xs text-slate-400">{CENTERS.filter((x) => x.city === c).length}</span>}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile city pills */}
        <div className="lg:hidden" />

        {/* Results */}
        <div className="flex-1">
          {/* Mobile city pills */}
          <div className="flex gap-2 flex-wrap mb-6 lg:hidden">
            {CITIES.map((c) => (
              <button key={c} onClick={() => setCity(c)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${city === c ? "bg-teal-500 text-white" : "bg-white border border-slate-200 text-slate-600"}`}>
                {c}
              </button>
            ))}
          </div>

          <p className="text-sm text-slate-500 mb-5">
            <span className="font-semibold text-slate-900">{filtered.length}</span> centers found
            {city !== "All Cities" && <span> in <span className="text-teal-600 font-medium">{city}</span></span>}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((center) => (
              <CenterCard
                key={center.id}
                center={center}
                onSelect={(selectedCenter) => navigate(`/centers/${selectedCenter.id}`)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-20 text-slate-400">
                <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
                No centers found for your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
