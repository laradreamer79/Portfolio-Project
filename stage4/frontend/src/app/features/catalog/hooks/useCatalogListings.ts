import { useEffect, useMemo, useState } from "react";
import { CITIES, type Center, type Trip } from "../../../data";
import { getCenters, getCourses, getTrips } from "../catalogService";

export const CATALOG_LEVELS = [
  "All Levels",
  "Beginner",
  "Open Water",
  "Intermediate",
  "Advanced",
];

type ExperienceKind = "trip" | "course";

export function useExperienceCatalog(kind: ExperienceKind) {
  const [city, setCity] = useState("All Cities");
  const [level, setLevel] = useState("All Levels");
  const [query, setQuery] = useState("");
  const [experiences, setExperiences] = useState<Trip[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const experienceRequest =
      kind === "trip"
        ? getTrips({
            city,
            search: query,
            difficulty:
              level === "All Levels" || level === "Open Water"
                ? undefined
                : level.toLowerCase(),
          })
        : getCourses({
            city,
            search: query,
            level: level === "All Levels" ? undefined : level,
          });

    Promise.all([experienceRequest, getCenters()])
      .then(([experienceData, centerData]) => {
        if (!active) return;
        setExperiences(experienceData);
        setCenters(centerData);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : kind === "trip"
              ? "Unable to load dive trips."
              : "Unable to load courses.",
        );
        setExperiences([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [city, kind, level, query]);

  const filteredExperiences = useMemo(
    () => experiences.filter((experience) => experience.type === kind),
    [experiences, kind],
  );

  return {
    centers,
    city,
    error,
    experiences: filteredExperiences,
    level,
    loading,
    query,
    setCity,
    setLevel,
    setQuery,
  };
}

export function useCentersCatalog(
  initialCity = "All Cities",
  initialQuery = "",
) {
  const [city, setCity] = useState(initialCity);
  const [query, setQuery] = useState(initialQuery);
  const [minRating, setMinRating] = useState(0);
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCity(initialCity);
  }, [initialCity]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getCenters({ city, search: query })
      .then((data) => {
        if (active) setCenters(data);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load diving centers.",
        );
        setCenters([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [city, query]);

  const filteredCenters = useMemo(
    () => centers.filter((center) => center.rating >= minRating),
    [centers, minRating],
  );

  return {
    centers,
    city,
    error,
    filteredCenters,
    loading,
    minRating,
    query,
    setCity,
    setMinRating,
    setQuery,
  };
}

export function useCityCatalog(city: string) {
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
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(
          requestError instanceof Error
            ? requestError.message
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
    [courses, trips],
  );

  return {
    centers,
    courses,
    error,
    experiences,
    loading,
    query,
    setQuery,
    trips,
  };
}

export function useFeaturedCatalog() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [courses, setCourses] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    Promise.all([getCenters(), getTrips(), getCourses()])
      .then(([centerData, tripData, courseData]) => {
        if (!active) return;
        setCenters(centerData);
        setTrips(tripData);
        setCourses(courseData);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load featured catalog data.",
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
  }, []);

  const cities = CITIES.filter((city) => city !== "All Cities");
  const featuredCenters = centers.filter((center) => center.verified).slice(0, 3);
  const featuredTrips = trips.slice(0, 3);
  const featuredCourses = courses.slice(0, 3);
  const centerCount = centers.length || "—";
  const cityCount =
    new Set(centers.map((center) => center.city)).size || cities.length;
  const listingCount = trips.length + courses.length || "—";

  function experienceCountForCity(city: string) {
    return [...trips, ...courses].filter(
      (experience) => experience.city === city,
    ).length;
  }

  return {
    centerCount,
    centers,
    cities,
    cityCount,
    error,
    experienceCountForCity,
    featuredCenters,
    featuredCourses,
    featuredTrips,
    listingCount,
    loading,
  };
}
