import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { type Center, type Review, type Trip } from "../data";
import { 
  ChevronLeft, Star, MapPin, Clock, Waves, Users, Calendar, 
  Shield, CheckCircle, AlertCircle, Phone, Mail, Award, BookOpen, GraduationCap
} from "lucide-react";
<<<<<<< HEAD
import { getCourseById, toReview } from "../lib/catalogService";
import { submitReview } from "../lib/reviewsService";
import { ReviewForm } from "../components/ReviewForm";
=======
import { getCourseById, getCourses } from "../lib/catalogService";
>>>>>>> origin/develop
import { useAuth } from "../hooks/useAuth";

export function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [course, setCourse] = useState<Trip | null>(null);
  const [center, setCenter] = useState<Center | undefined>();
  const [courseReviews, setCourseReviews] = useState<Review[]>([]);
  const [similarCourses, setSimilarCourses] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const courseId = Number(id);

    if (!Number.isInteger(courseId)) {
      setError("Invalid course id.");
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    getCourseById(courseId, token)
      .then((data) => {
        if (!active) return;
        setCourse(data.course);
        setCenter(data.center);
        setCourseReviews(data.reviews);
        return getCourses(data.center?.city ? { city: data.center.city } : {}, token).then((courses) => {
          if (!active) return;
          setSimilarCourses(
            courses
              .filter((candidate) => candidate.id !== data.course.id)
              .slice(0, 3),
          );
        });
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load course.");
        setCourse(null);
        setCenter(undefined);
        setCourseReviews([]);
        setSimilarCourses([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, token]);
  
  const avgRating = courseReviews.length > 0 
    ? (courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length).toFixed(1)
    : "N/A";

  if (loading) {
    return <div className="flex items-center justify-center h-96 text-slate-400">Loading course...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-96 text-red-500">{error}</div>;
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-slate-400">Course not found.</p>
        <button onClick={() => navigate("/courses")} className="text-purple-600 text-sm font-medium">
          ← Back to Courses
        </button>
      </div>
    );
  }

  const includedItems = [
    "Full PADI certification materials (digital & physical)",
    "All dive equipment rental throughout the course",
    "Experienced PADI-certified instructor (max 4 students)",
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
    "Positive attitude and willingness to learn",
  ];

  const prerequisites = course.level === "Beginner" 
    ? ["Minimum age 10 years", "Basic swimming ability", "Good health (medical form required)"]
    : course.level === "Intermediate"
    ? ["PADI Open Water certification (or equivalent)", "Minimum age 12 years", "Recent diving experience recommended"]
    : ["PADI Advanced Open Water certification", "Minimum 20+ logged dives", "Excellent buoyancy control"];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] bg-slate-900">
        <img 
          src={course.img} 
          alt={course.title} 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/40 to-transparent" />
        
        <div className="absolute top-6 left-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-white/90 hover:text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full inline-block mb-3 bg-purple-500 text-white">
              <GraduationCap className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
              PADI Course
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white tracking-wide mb-3">
              {course.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <button
                onClick={() => center && navigate(`/centers/${center.id}`)}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4" />
                {center ? `${center.name} · ${center.city}` : "Independent Instructor"}
              </button>
              {courseReviews.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{avgRating}</span>
                  <span className="text-white/70">({courseReviews.length} reviews)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Quick Info Cards */}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <Clock className="w-5 h-5 text-purple-600 mb-2" />
                <div className="text-2xl font-bold text-slate-900">{course.duration}</div>
                <div className="text-xs text-slate-500 mt-1">Duration</div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <Waves className="w-5 h-5 text-purple-600 mb-2" />
                <div className="text-2xl font-bold text-slate-900">{course.depth}</div>
                <div className="text-xs text-slate-500 mt-1">Depth Range</div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <Shield className="w-5 h-5 text-purple-600 mb-2" />
                <div className="text-2xl font-bold text-slate-900">{course.level}</div>
                <div className="text-xs text-slate-500 mt-1">Level</div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <Users className="w-5 h-5 text-purple-600 mb-2" />
                <div className="text-2xl font-bold text-slate-900">{course.slots}</div>
                <div className="text-xs text-slate-500 mt-1">Available Spots</div>
              </div>
            </div>

            {/* About This Course */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100">
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-600" />
                ABOUT THIS COURSE
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">{course.description}</p>
              <p className="text-slate-600 leading-relaxed">
                This comprehensive PADI certification course combines classroom theory, confined water training, 
                and open water dives to ensure you develop the skills and confidence needed to dive safely. 
                Our experienced instructors maintain small class sizes (maximum 4 students) to provide 
                personalized attention and support throughout your learning journey.
              </p>
            </div>

            {/* Prerequisites */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-3xl p-8 border border-purple-200">
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-purple-600" />
                PREREQUISITES
              </h2>
              <ul className="space-y-3">
                {prerequisites.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100">
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide mb-4">
                WHAT'S INCLUDED
              </h2>
              <ul className="space-y-3">
                {includedItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What to Bring */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100">
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide mb-4">
                WHAT TO BRING
              </h2>
              <ul className="space-y-3">
                {whatToBring.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2.5 flex-shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide">
                  REVIEWS
                </h2>
                {courseReviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="text-2xl font-bold text-slate-900">{avgRating}</span>
                    <span className="text-slate-400">({courseReviews.length})</span>
                  </div>
                )}
              </div>
              
              {courseReviews.length > 0 ? (
                <div className="space-y-6">
                  {courseReviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="flex gap-4">
                        <img 
                          src={review.avatar} 
                          alt={review.user} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-slate-900">{review.user}</span>
                            <span className="text-xs text-slate-400">· {review.date}</span>
                          </div>
                          <div className="flex gap-0.5 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-4 h-4 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                              />
                            ))}
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400">No reviews yet for this course.</p>
                  <p className="text-slate-400 text-sm mt-1">Be the first to share your experience!</p>
                </div>
              )}

              <ReviewForm
                label={course.title}
                onSubmit={async (rating, comment) => {
                  if (!token) return;
                  const created = await submitReview({ courseId: course.id, rating, comment }, token);
                  setCourseReviews((prev) => [toReview(created), ...prev]);
                }}
              />
            </div>

            {/* Similar Courses */}
            {similarCourses.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide mb-4">
                  SIMILAR COURSES
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {similarCourses.map((c) => {
                    return (
                      <button
                        key={c.id}
                        onClick={() => navigate(`/courses/${c.id}`)}
                        className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-purple-200 hover:shadow-md transition-all text-left"
                      >
                        <div className="h-32 overflow-hidden">
                          <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-slate-900 mb-2 line-clamp-1">{c.title}</h3>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {center?.city ?? "Oyster listing"}
                            </span>
                            <span className="font-bold text-purple-600 text-sm">SAR {c.price}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 lg:sticky lg:top-6">
              <div className="mb-6">
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  SAR {course.price}
                </div>
                <div className="text-sm text-slate-500">Full course price</div>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span className="text-slate-600">Starts {course.date}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-slate-600">{course.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-slate-600">{course.slots} spots remaining</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span className="text-slate-600">PADI Certified</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/booking/course/${course.id}`)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-xl transition-colors mb-4"
              >
                Reserve Your Spot
              </button>

              <p className="text-xs text-center text-slate-400 mb-6">
                You won't be charged yet
              </p>

              {center && (
                <div className="space-y-3 pt-6 border-t border-slate-100">
                  <h3 className="font-semibold text-slate-900 text-sm mb-3">Contact Center</h3>
                  <a
                    href={`tel:${center.phone}`}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-purple-600 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {center.phone}
                  </a>
                  <a
                    href={`mailto:${center.email}`}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-purple-600 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {center.email}
                  </a>
                </div>
              )}

              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-xs text-purple-800 leading-relaxed mt-6">
                <strong>Free cancellation</strong> up to 7 days before course start. Full refund guaranteed.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
