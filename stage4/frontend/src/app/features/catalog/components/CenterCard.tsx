import { ChevronRight, MapPin, Shield, Star } from "lucide-react";
import type { Center } from "../../../data";

type CenterCardProps = {
  center: Center;
  variant?: "featured" | "catalog";
  onSelect: (center: Center) => void;
};

export function CenterCard({ center, variant = "catalog", onSelect }: CenterCardProps) {
  const featured = variant === "featured";

  return (
    <button
      type="button"
      onClick={() => onSelect(center)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className={`relative overflow-hidden bg-slate-100 ${featured ? "h-48" : "h-44"}`}>
        <img src={center.img} alt={center.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {!featured && <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />}
        {center.verified && (
          <div className={`absolute left-3 top-3 flex items-center gap-1 rounded-full bg-teal-500 text-xs font-semibold text-white ${featured ? "px-2.5 py-1" : "px-2 py-0.5"}`}>
            <Shield className="h-3 w-3" /> Verified
          </div>
        )}
        {!featured && (
          <div className="absolute bottom-3 right-3 rounded-lg bg-white/90 px-2 py-1 text-xs font-semibold text-slate-900 backdrop-blur">
            {center.priceRange}
          </div>
        )}
      </div>

      <div className={`flex flex-1 flex-col ${featured ? "p-5" : "p-4"}`}>
        <div className="mb-1 flex items-start justify-between">
          <h3 className={`font-display font-bold leading-tight tracking-wide text-slate-900 ${featured ? "text-xl" : "text-lg"}`}>{center.name}</h3>
          <span className="ml-2 flex flex-shrink-0 items-center gap-0.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-slate-700">{center.rating}</span>
          </span>
        </div>

        <p className={`flex items-center gap-1 text-slate-400 ${featured ? "mb-3 text-sm" : "mb-2 text-xs"}`}>
          <MapPin className="h-3 w-3 text-teal-500" />{center.city}
        </p>
        <p className={`flex-1 text-sm leading-relaxed text-slate-500 ${featured ? "mb-4" : "mb-3 line-clamp-2"}`}>{center.description}</p>

        {!featured && (
          <div className="mb-3 flex flex-wrap gap-1">
            {center.specialties.slice(0, 3).map((specialty) => (
              <span key={specialty} className="rounded-full border border-teal-100 bg-teal-50 px-2 py-0.5 text-xs text-teal-700">{specialty}</span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          {featured ? (
            <>
              <span className="text-sm font-semibold text-slate-700">{center.priceRange}</span>
              <span className="text-xs text-slate-400">{center.reviews} reviews</span>
            </>
          ) : (
            <>
              <span className="text-xs text-slate-400">{center.reviews} reviews</span>
              <span className="flex items-center gap-0.5 text-sm font-medium text-teal-600">View <ChevronRight className="h-3.5 w-3.5" /></span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}
