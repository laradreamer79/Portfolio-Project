import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Star } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "../lib/apiClient";

type ReviewFormProps = {
  /** Called with a validated rating (1-5) and non-empty comment. Should throw on failure. */
  onSubmit: (rating: number, comment: string) => Promise<void>;
  label?: string;
};

export function ReviewForm({ onSubmit, label = "your experience" }: ReviewFormProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 mt-6 text-sm text-slate-600">
        <button
          onClick={() => navigate("/auth", { state: { from: `${location.pathname}${location.search}` } })}
          className="text-teal-600 font-semibold hover:text-teal-800"
        >
          Log in
        </button>{" "}
        to leave a review.
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 mt-6">
        <p className="text-teal-600 font-medium text-sm">Thank you for your review!</p>
      </div>
    );
  }

  async function handleSubmit() {
    if (isSubmitting) return; // prevent duplicate submissions
    if (rating < 1 || rating > 5 || !comment.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(rating, comment.trim());
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to submit your review. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 mt-6">
      <h3 className="font-display text-xl font-bold text-slate-900 tracking-wide mb-4">Leave a Review</h3>
      {error && (
        <div className="mb-3 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Rating:</span>
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} type="button" onClick={() => setRating(i)}>
              <Star className={`w-5 h-5 transition-colors ${i <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300 hover:text-amber-300"}`} />
            </button>
          ))}
        </div>
        <textarea
          rows={3}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 bg-white resize-none"
          placeholder={`Share your experience with ${label}...`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={!comment.trim() || isSubmitting}
          className="bg-teal-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-teal-600 transition-colors disabled:opacity-40 text-sm"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}
