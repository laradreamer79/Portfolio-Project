import { AlertCircle, ChevronRight, Star, X } from "lucide-react";
import type { CenterRow, ReviewRow } from "./useAdminDashboard";

type AdminReviewsProps = {
  centers: CenterRow[];
  reviews: ReviewRow[];
  onRemove: (id: number) => void;
  onViewCenter: (id: number) => void;
};

export function AdminReviews({
  centers,
  reviews,
  onRemove,
  onViewCenter,
}: AdminReviewsProps) {
  return (
    <div>
      <h2 className="font-display mb-6 text-2xl font-bold tracking-wide text-slate-900">
        ALL REVIEWS
      </h2>
      <div className="space-y-4">
        {reviews.map((review) => {
          const center = centers.find(
            (candidate) => candidate.id === review.centerId,
          );
          const isSpam = review.rating <= 2;

          return (
            <div
              key={review.id}
              className={`flex gap-4 rounded-2xl border bg-white p-5 ${
                isSpam ? "border-red-200 bg-red-50" : "border-slate-100"
              }`}
            >
              <img
                src={review.avatar}
                alt={review.user}
                className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white object-cover shadow"
              />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    {review.user}
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Star
                        key={rating}
                        className={`h-3.5 w-3.5 ${
                          rating <= review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  {center && (
                    <button
                      onClick={() => onViewCenter(center.id)}
                      className="flex items-center gap-0.5 text-xs font-medium text-teal-600 hover:text-teal-800"
                    >
                      {center.name} <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                  <span className="text-xs text-slate-400">{review.date}</span>
                  {isSpam && (
                    <span className="flex items-center gap-1 rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                      <AlertCircle className="h-3 w-3" /> Flagged
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm leading-relaxed ${
                    isSpam ? "text-red-700" : "text-slate-600"
                  }`}
                >
                  {review.comment}
                </p>
              </div>
              <button
                onClick={() => onRemove(review.id)}
                className="self-start rounded-xl p-2 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                title="Remove review"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
        {reviews.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            <Star className="mx-auto mb-3 h-10 w-10 opacity-20" />
            No reviews on the platform yet.
          </div>
        )}
      </div>
    </div>
  );
}
