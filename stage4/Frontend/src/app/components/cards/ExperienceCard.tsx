import { ArrowRight, Calendar, Clock, GraduationCap, MapPin, Users, Waves } from "lucide-react";
import type { Center, Trip } from "../../data";

type ExperienceCardProps = {
  experience: Trip;
  center?: Center;
  variant?: "featured" | "catalog";
  onOpen: (experience: Trip) => void;
  onBook: (experience: Trip) => void;
  onCenterSelect?: (center: Center) => void;
};

const levelClass: Record<string, string> = {
  Beginner: "border-emerald-100 bg-emerald-50 text-emerald-700",
  "Open Water": "border-sky-100 bg-sky-50 text-sky-700",
  Intermediate: "border-amber-100 bg-amber-50 text-amber-700",
  Advanced: "border-rose-100 bg-rose-50 text-rose-700",
};

export function ExperienceCard({
  experience,
  center,
  variant = "catalog",
  onOpen,
  onBook,
  onCenterSelect,
}: ExperienceCardProps) {
  const featured = variant === "featured";
  const course = experience.type === "course";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <button
        type="button"
        onClick={() => onOpen(experience)}
        className="relative h-48 w-full overflow-hidden bg-slate-100 text-left"
      >
        <img src={experience.img} alt={experience.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {(course || !featured) && (
          <div className="absolute left-3 top-3">
            <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white ${course ? "bg-purple-500" : "bg-teal-500"}`}>
              {course && <GraduationCap className="h-3 w-3" />}
              {course ? "Course" : "Trip"}
            </span>
          </div>
        )}
        <div className="absolute right-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 text-sm font-bold text-slate-900 backdrop-blur">
          SAR {experience.price.toLocaleString()}
        </div>
        {experience.slots <= 4 && (
          <div className="absolute bottom-3 left-3 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-medium text-white">
            {experience.slots} spots left
          </div>
        )}
      </button>

      <div className="flex flex-1 flex-col p-4">
        <button type="button" onClick={() => onOpen(experience)} className="text-left">
          <h3 className={`font-display mb-1 text-xl font-bold leading-tight tracking-wide text-slate-900 transition-colors ${course ? "hover:text-purple-600" : "hover:text-teal-600"}`}>
            {experience.title}
          </h3>
        </button>

        {center && (
          <button
            type="button"
            onClick={() => onCenterSelect?.(center)}
            className="mb-3 flex items-center gap-1 text-left text-xs font-medium text-teal-600 transition-colors hover:text-teal-800"
          >
            <MapPin className={`h-3 w-3 ${course && featured ? "text-purple-500" : "text-teal-500"}`} />
            {center.name} · {center.city}
          </button>
        )}

        {!featured && <p className="mb-3 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">{experience.description}</p>}

        <div className={`flex flex-wrap gap-3 text-xs text-slate-500 ${featured ? "mb-4" : "mb-3"}`}>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-300" />{experience.duration}</span>
          <span className="flex items-center gap-1"><Waves className="h-3.5 w-3.5 text-slate-300" />{experience.depth}</span>
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-slate-300" />{experience.slots} {course ? "spots" : "open"}</span>
          {!featured && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-slate-300" />{experience.date}</span>}
        </div>

        {featured ? (
          <button
            type="button"
            onClick={() => onBook(experience)}
            className={`mt-auto flex w-full items-center justify-center gap-1 rounded-xl py-2 text-sm font-semibold text-white transition-colors ${course ? "bg-purple-500 hover:bg-purple-600" : "bg-teal-500 hover:bg-teal-600"}`}
          >
            {course ? "Enroll Now" : "Book Now"} <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <span className={`rounded-full border px-2 py-0.5 text-xs ${levelClass[experience.level] ?? levelClass.Advanced}`}>{experience.level}</span>
            <button
              type="button"
              onClick={() => onBook(experience)}
              className={`flex items-center gap-1 rounded-xl px-4 py-1.5 text-sm font-semibold text-white transition-colors ${course ? "bg-purple-500 hover:bg-purple-600" : "bg-teal-500 hover:bg-teal-600"}`}
            >
              {course ? "Enroll" : "Book"} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
