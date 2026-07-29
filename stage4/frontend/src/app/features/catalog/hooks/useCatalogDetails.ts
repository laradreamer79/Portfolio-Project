import { useEffect, useState } from "react";
import type { Center, Review, Trip } from "../../../data";
import {
  getCenterById,
  getCourseById,
  getCourses,
  getTripById,
  getTrips,
} from "../catalogService";

type ExperienceKind = "trip" | "course";

export function useExperienceDetail(
  kind: ExperienceKind,
  id: string | undefined,
  token?: string | null,
) {
  const [experience, setExperience] = useState<Trip | null>(null);
  const [center, setCenter] = useState<Center | undefined>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarExperiences, setSimilarExperiences] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const experienceId = Number(id);

    if (!Number.isInteger(experienceId)) {
      setError(`Invalid ${kind} id.`);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    async function load() {
      try {
        if (kind === "trip") {
          const data = await getTripById(experienceId, token);
          if (!active) return;

          setExperience(data.trip);
          setCenter(data.center);
          setReviews(data.reviews);

          const related = await getTrips(
            data.center?.city ? { city: data.center.city } : {},
            token,
          );
          if (!active) return;
          setSimilarExperiences(
            related
              .filter((candidate) => candidate.id !== data.trip.id)
              .slice(0, 3),
          );
          return;
        }

        const data = await getCourseById(experienceId, token);
        if (!active) return;

        setExperience(data.course);
        setCenter(data.center);
        setReviews(data.reviews);

        const related = await getCourses(
          data.center?.city ? { city: data.center.city } : {},
          token,
        );
        if (!active) return;
        setSimilarExperiences(
          related
            .filter((candidate) => candidate.id !== data.course.id)
            .slice(0, 3),
        );
      } catch (requestError) {
        if (!active) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : `Unable to load ${kind}.`,
        );
        setExperience(null);
        setCenter(undefined);
        setReviews([]);
        setSimilarExperiences([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [id, kind, token]);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "N/A";

  function addReview(review: Review) {
    setReviews((current) => [review, ...current]);
  }

  return {
    addReview,
    averageRating,
    center,
    error,
    experience,
    loading,
    reviews,
    similarExperiences,
  };
}

export function useCenterDetail(id: string | undefined) {
  const [center, setCenter] = useState<Center | null>(null);
  const [experiences, setExperiences] = useState<Trip[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const centerId = Number(id);

    if (!Number.isInteger(centerId)) {
      setError("Invalid center id.");
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    async function loadCenter() {
      try {
        const data = await getCenterById(centerId);
        if (!active) return;
        setCenter(data.center);
        setExperiences([...data.trips, ...data.courses]);
        setReviews(data.reviews);
      } catch (requestError) {
        if (!active) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load center.",
        );
        setCenter(null);
        setExperiences([]);
        setReviews([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCenter();

    return () => {
      active = false;
    };
  }, [id]);

  function addReview(review: Review) {
    setReviews((current) => [review, ...current]);
  }

  return {
    addReview,
    center,
    error,
    experiences,
    loading,
    reviews,
  };
}
