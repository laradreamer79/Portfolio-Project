import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { useExperienceDetail } from "../features/catalog";
import { ReviewForm, useReviewSubmission } from "../features/reviews";
import { useAuth } from "../hooks/useAuth";

const providerImageFallback = "/favicon.svg";

export function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const {
    addReview,
    averageRating: avgRating,
    center,
    error,
    experience: course,
    loading,
    reviews: courseReviews,
    similarExperiences: similarCourses,
  } = useExperienceDetail("course", id, token);
  const handleReviewSubmit = useReviewSubmission({
    token,
    target: "course",
    targetId: Number(id),
    onCreated: addReview,
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-400">
        Loading course...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-slate-400">Course not found.</p>
        <button
          onClick={() => navigate("/courses")}
          className="text-sm font-medium text-purple-600"
        >
          ← Back to Courses
        </button>
      </div>
    );
  }

  const providerImage = center?.img || providerImageFallback;

  const includedItems = [
    "Full PADI certification materials (digital and physical)",
    "All dive equipment rental throughout the course",
    "Experienced PADI-certified instructor",
    "Boat trips and dive site access",
    "Digital certification card upon completion",
    "Logbook and training slate",
  ];

  const whatToBring = [
    "Valid ID or passport",
    "Medical clearance form (if required)",
    "Swimwear and towel",
    "Sunscreen (reef-safe)",
    "Notebook for theory sessions",
  ];

  const prerequisites =
    course.level === "Beginner"
      ? [
          "Minimum age 10 years",
          "Basic swimming ability",
          "Good health (medical form required)",
        ]
      : course.level === "Intermediate"
        ? [
            "PADI Open Water certification (or equivalent)",
            "Minimum age 12 years",
            "Recent diving experience recommended",
          ]
        : [
            "PADI Advanced Open Water certification",
            "Minimum 20 logged dives",
            "Excellent buoyancy control",
          ];

  const quickInfo = [
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Duration",
      value: course.duration,
    },
    {
      icon: <GraduationCap className="h-5 w-5" />,
      label: "Level",
      value: course.level,
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Spots",
      value: course.slots,
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Start Date",
      value: course.date,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative h-[400px] bg-slate-900 md:h-[500px]">
        <img
          src={course.img}
          alt={course.title}
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

        <div className="absolute left-6 top-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl bg-black/30 px-4 py-2 text-white/90 backdrop-blur-sm transition-colors hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="mx-auto max-w-6xl">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-purple-500 px-3 py-1.5 text-xs font-semibold text-white">
              <GraduationCap className="h-3.5 w-3.5" />
              Course
            </span>
            <h1 className="mb-3 font-display text-4xl font-bold tracking-wide text-white md:text-5xl">
              {course.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <button
                onClick={() => center && navigate(`/centers/${center.id}`)}
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <MapPin className="h-4 w-4" />
                {center
                  ? `${center.name} · ${center.city}`
                  : "Independent Instructor"}
              </button>
              {courseReviews.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{avgRating}</span>
                  <span className="text-white/70">
                    ({courseReviews.length} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {quickInfo.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-slate-50 p-3 text-center"
                  >
                    <div className="mb-2 flex justify-center text-purple-500">
                      {item.icon}
                    </div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-400">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6">
              <h2 className="mb-4 font-display text-2xl font-bold tracking-wide text-slate-900">
                ABOUT THIS COURSE
              </h2>
              <p className="mb-4 leading-relaxed text-slate-600">
                {course.description}
              </p>
              <p className="leading-relaxed text-slate-600">
                This certification course combines theory, confined-water
                training, and open-water dives. The instructor guides students
                through the skills and safety practices required for the
                selected course level.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6">
              <h2 className="mb-4 font-display text-2xl font-bold tracking-wide text-slate-900">
                PREREQUISITES
              </h2>
              <div className="space-y-2.5">
                {prerequisites.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-500" />
                    <span className="text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6">
              <h2 className="mb-4 font-display text-2xl font-bold tracking-wide text-slate-900">
                WHAT&apos;S INCLUDED
              </h2>
              <div className="space-y-2.5">
                {includedItems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-500" />
                    <span className="text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6">
              <h2 className="mb-4 font-display text-2xl font-bold tracking-wide text-slate-900">
                WHAT TO BRING
              </h2>
              <div className="space-y-2.5">
                {whatToBring.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-400" />
                    <span className="text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">
                    REVIEWS
                  </h2>
                  {courseReviews.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        <span className="text-lg font-bold text-slate-900">
                          {avgRating}
                        </span>
                      </div>
                      <span className="text-sm text-slate-400">
                        · {courseReviews.length} review
                        {courseReviews.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {courseReviews.length > 0 ? (
                <div className="space-y-5">
                  {courseReviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-slate-100 pb-5 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={review.avatar}
                          alt={review.user}
                          className="h-12 w-12 flex-shrink-0 rounded-full border-2 border-white object-cover shadow"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="font-semibold text-slate-900">
                              {review.user}
                            </span>
                            <span className="text-xs text-slate-400">
                              · {review.date}
                            </span>
                          </div>
                          <div className="mb-2 flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm leading-relaxed text-slate-600">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Star className="mx-auto mb-3 h-12 w-12 text-slate-200" />
                  <p className="text-slate-400">
                    No reviews yet for this course.
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Be the first to share your experience!
                  </p>
                </div>
              )}

              <ReviewForm
                label={course.title}
                onSubmit={handleReviewSubmit}
              />
            </div>

            {similarCourses.length > 0 && (
              <div>
                <h2 className="mb-4 font-display text-2xl font-bold tracking-wide text-slate-900">
                  SIMILAR COURSES
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {similarCourses.map((similarCourse) => (
                    <button
                      key={similarCourse.id}
                      onClick={() =>
                        navigate(`/courses/${similarCourse.id}`)
                      }
                      className="overflow-hidden rounded-2xl border border-slate-100 bg-white text-left transition-all hover:border-purple-200 hover:shadow-md"
                    >
                      <div className="h-32 overflow-hidden">
                        <img
                          src={similarCourse.img}
                          alt={similarCourse.title}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700">
                          Course
                        </span>
                        <h3 className="mt-2 line-clamp-2 font-semibold text-slate-900">
                          {similarCourse.title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-400">
                          {center?.city ?? "Oyster listing"}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="font-bold text-purple-600">
                            SAR {similarCourse.price}
                          </span>
                          <span className="text-xs text-slate-400">
                            {similarCourse.level}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-5 rounded-2xl border border-slate-100 bg-white p-6">
              <div>
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-purple-600">
                    SAR {course.price}
                  </span>
                  <span className="text-sm text-slate-400">full course</span>
                </div>
                <p className="text-xs text-slate-400">
                  {course.slots} spots available · Starts {course.date}
                </p>
              </div>

              <button
                onClick={() => navigate(`/booking/course/${course.id}`)}
                className="w-full rounded-xl bg-purple-500 py-3.5 font-semibold text-white transition-colors hover:bg-purple-600"
              >
                Enroll Now
              </button>

              <div className="space-y-3 border-t border-slate-100 pt-5">
                <h3 className="text-sm font-semibold text-slate-900">
                  Provided by
                </h3>
                <button
                  onClick={() => center && navigate(`/centers/${center.id}`)}
                  className="-m-2 flex w-full items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50"
                >
                  <img
                    src={providerImage}
                    alt={center?.name ?? "Independent Instructor"}
                    onError={(event) => {
                      event.currentTarget.src = providerImageFallback;
                    }}
                    className="h-12 w-12 rounded-xl border border-slate-100 object-cover"
                  />
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {center?.name ?? "Independent Instructor"}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      {center?.verified && (
                        <Shield className="h-3 w-3 text-purple-500" />
                      )}
                      <span className="text-xs text-slate-400">
                        {center?.city ?? "Instructor-owned listing"}
                      </span>
                    </div>
                  </div>
                </button>

                {center && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-900">
                      {center.rating}
                    </span>
                    <span className="text-slate-400">
                      ({center.reviews} reviews)
                    </span>
                  </div>
                )}
              </div>

              {center && (
                <div className="space-y-2.5 border-t border-slate-100 pt-5">
                  <a
                    href={`tel:${center.phone}`}
                    className="flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-purple-600"
                  >
                    <Phone className="h-4 w-4" />
                    {center.phone}
                  </a>
                  <a
                    href={`mailto:${center.email}`}
                    className="flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-purple-600"
                  >
                    <Mail className="h-4 w-4" />
                    {center.email}
                  </a>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
