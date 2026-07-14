import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, GraduationCap, Search, Waves } from "lucide-react";
import type { Center, Trip } from "../data";
import { ExperienceCard } from "../components/cards/ExperienceCard";
import { getCenters, getCourses, getTrips } from "../lib/catalogService";

export function CityCatalog() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city") ?? "All Cities";
  const cityLabel = city === "All Cities" ? "All Cities" : city;
  const [query, setQuery] = useState("");
  const [centers, setCenters] = useState<Center[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [courses, setCourses] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    Promise.all([
      getCenters({ city }),
      getTrips({ city, search: query }),
      getCourses({ city, search: query }),
    ])
      .then(([centerData, tripData, courseData]) => {
        if (!active) return;
        setCenters(centerData);
        setTrips(tripData);
        setCourses(courseData);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load city experiences.",
        );
        setCenters([]);
        setTrips([]);
        setCourses([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [city, query]);

  const experiences = useMemo(
    () => [...trips, ...courses].sort((a, b) => a.date.localeCompare(b.date)),
    [trips, courses],
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <button
            onClick={() => navigate("/")}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-teal-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>

          <p className="text-teal-600 text-sm font-medium tracking-widest uppercase mb-2">
            Dive destination
          </p>
          <h1 className="font-display text-5xl font-bold text-slate-900 tracking-wide mb-3">
            {cityLabel} Trips & Courses
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            {city === "All Cities"
              ? "Browse available trips and courses from all providers."
              : `Browse available trips and courses from providers in ${city}.`}
          </p>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              className="flex-1 text-sm text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent"
              placeholder={
                city === "All Cities"
                  ? "Search trips and courses..."
                  : `Search trips and courses in ${city}...`
              }
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          {loading ? (
            "Loading experiences..."
          ) : (
            <>
              <span>
                <span className="font-semibold text-slate-900">
                  {experiences.length}
                </span>{" "}
                experiences available
              </span>
              <span className="text-slate-300">•</span>
              <span>{trips.length} trips</span>
              <span className="text-slate-300">•</span>
              <span>{courses.length} courses</span>
            </>
          )}
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-400">
            Loading trips and courses...
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <div className="mb-3 flex justify-center gap-3 opacity-30">
              <Waves className="w-10 h-10" />
              <GraduationCap className="w-10 h-10" />
            </div>
            No trips or courses match this city yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {experiences.map((experience) => {
              const center = centers.find(
                (candidate) => candidate.id === experience.centerId,
              );

              return (
                <ExperienceCard
                  key={`${experience.type}-${experience.id}`}
                  experience={experience}
                  center={center}
                  onOpen={(selectedExperience) =>
                    navigate(
                      selectedExperience.type === "course"
                        ? `/courses/${selectedExperience.id}`
                        : `/trips/${selectedExperience.id}`,
                    )
                  }
                  onBook={(selectedExperience) =>
                    navigate(`/booking/${selectedExperience.type}/${selectedExperience.id}`)
                  }
                  onCenterSelect={(selectedCenter) =>
                    navigate(`/centers/${selectedCenter.id}`)
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
