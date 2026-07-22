export function validateReview(rating: number, comment: string) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return "Choose a rating between 1 and 5.";
  }

  if (!comment.trim()) return "Enter a review comment.";
  return null;
}
