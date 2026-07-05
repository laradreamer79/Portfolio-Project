import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, GraduationCap } from "lucide-react";
import { TRIPS, CENTERS, CITIES } from "../data";
import { ExperienceCard } from "../components/cards/ExperienceCard";

const LEVELS = ["All Levels", "Beginner", "Open Water", "Intermediate", "Advanced"];

export function Courses() {
  const navigate = useNavigate();
  const [city, setCity] = useState("All Cities");
  const [level, setLevel] = useState("All Levels");
  const [query, setQuery] = useState("");

  const filtered = TRIPS.filter((t) => {
    const center = CENTERS.find((c) => c.id === t.centerId);
    const matchCity = city === "All Cities" || center?.city === city;
    const matchLevel = level === "All Levels" || t.level === level;
    const matchQuery = !query || t.title.toLowerCase().includes(query.toLowerCase()) || center?.name.toLowerCase().includes(query.toLowerCase());
    return t.type === "course" && matchCity && matchLevel && matchQuery;
  });

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
            <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-teal-400" value={city} onChange={(e) => setCity(e.target.value)}>
              {CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-teal-400" value={level} onChange={(e) => setLevel(e.target.value)}>
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Active filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {city !== "All Cities" && <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">{city} <button onClick={() => setCity("All Cities")} className="ml-1 hover:text-purple-900">×</button></span>}
          {level !== "All Levels" && <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">{level} <button onClick={() => setLevel("All Levels")} className="ml-1 hover:text-purple-900">×</button></span>}
        </div>

        <p className="text-sm text-slate-500 mb-6"><span className="font-semibold text-slate-900">{filtered.length}</span> courses available</p>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
            No courses match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((course) => {
              const center = CENTERS.find((c) => c.id === course.centerId);
              return (
                <ExperienceCard
                  key={course.id}
                  experience={course}
                  center={center}
                  onOpen={(selectedCourse) => navigate(`/courses/${selectedCourse.id}`)}
                  onBook={(selectedCourse) => navigate(`/booking/${selectedCourse.id}`)}
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
