import { useNavigate } from "react-router-dom";
import { ChevronDown, Search, GraduationCap } from "lucide-react";
import { CITIES } from "../data";
import {
  CATALOG_LEVELS,
  ExperienceCard,
  useExperienceCatalog,
} from "../features/catalog";

export function Courses() {
  const navigate = useNavigate();
  const {
    centers,
    city,
    error,
    experiences: filtered,
    level,
    loading,
    query,
    setCity,
    setLevel,
    setQuery,
  } = useExperienceCatalog("course");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-teal-600 text-sm font-medium tracking-widest uppercase mb-2">Learn to Dive</p>
          <h1 className="font-display text-5xl font-bold text-slate-900 tracking-wide mb-2">TRAINING COURSES</h1>
          <p className="text-slate-400 text-sm mb-6">From your first breath underwater to advanced certifications — find the right course across Saudi Arabia.</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
              <Search className="w-4 h-4 text-slate-400" />
              <input className="flex-1 text-sm text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent" placeholder="Search courses..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="relative">
              <select className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-teal-400" value={city} onChange={(e) => setCity(e.target.value)}>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="relative">
              <select className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-teal-400" value={level} onChange={(e) => setLevel(e.target.value)}>
                {CATALOG_LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Active filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {city !== "All Cities" && <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">{city} <button onClick={() => setCity("All Cities")} className="ml-1 hover:text-purple-900">×</button></span>}
          {level !== "All Levels" && <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">{level} <button onClick={() => setLevel("All Levels")} className="ml-1 hover:text-purple-900">×</button></span>}
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <p className="text-sm text-slate-500 mb-6">
          {loading ? "Loading courses..." : <><span className="font-semibold text-slate-900">{filtered.length}</span> courses available</>}
        </p>

        {loading ? (
          <div className="text-center py-20 text-slate-400">
            Loading courses...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
            No courses match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((course) => {
              const center = centers.find((c) => c.id === course.centerId);
              return (
                <ExperienceCard
                  key={course.id}
                  experience={course}
                  center={center}
                  onOpen={(selectedCourse) => navigate(`/courses/${selectedCourse.id}`)}
                  onBook={(selectedCourse) => navigate(`/booking/${selectedCourse.type}/${selectedCourse.id}`)}
                  onCenterSelect={(selectedCenter) => navigate(`/centers/${selectedCenter.id}`)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
