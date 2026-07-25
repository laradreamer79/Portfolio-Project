import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { FormFieldError } from "../../components/FormFieldError";
import { useAuth } from "../../hooks/useAuth";
import { ApiError } from "../../lib/apiClient";
import {
  hasFieldErrors,
  type FieldErrors,
} from "../../lib/validation";
import { validateReview } from "./reviewValidation";

type ReviewFormProps = {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  label?: string;
};

export function ReviewForm({
  onSubmit,
  label = "your experience",
}: ReviewFormProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    FieldErrors<"rating" | "comment">
  >({});
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        <button
          onClick={() =>
            navigate("/auth", {
              state: { from: `${location.pathname}${location.search}` },
            })
          }
          className="font-semibold text-teal-600 hover:text-teal-800"
        >
          Log in
        </button>{" "}
        to leave a review.
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-medium text-teal-600">
          Thank you for your review!
        </p>
      </div>
    );
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    const errors = validateReview(rating, comment);
    setFieldErrors(errors);
    if (hasFieldErrors(errors)) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(rating, comment.trim());
      setSubmitted(true);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to submit your review. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="mb-4 font-display text-xl font-bold tracking-wide text-slate-900">
        Leave a Review
      </h3>
      {error && (
        <div className="mb-3 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Rating:</span>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setRating(value);
                setFieldErrors((current) => ({
                  ...current,
                  rating: undefined,
                }));
              }}
              aria-label={`Rate ${value} out of 5`}
            >
              <Star
                className={`h-5 w-5 transition-colors ${
                  value <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300 hover:text-amber-300"
                }`}
              />
            </button>
          ))}
        </div>
        <FormFieldError
          id="review-rating-error"
          message={fieldErrors.rating}
        />
        <textarea
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-teal-400 focus:outline-none"
          placeholder={`Share your experience with ${label}...`}
          value={comment}
          onChange={(event) => {
            setComment(event.target.value);
            setFieldErrors((current) => ({
              ...current,
              comment: undefined,
            }));
          }}
          aria-invalid={Boolean(fieldErrors.comment)}
          aria-describedby={
            fieldErrors.comment ? "review-comment-error" : undefined
          }
        />
        <FormFieldError
          id="review-comment-error"
          message={fieldErrors.comment}
        />
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="rounded-xl bg-teal-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-600 disabled:opacity-40"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}
