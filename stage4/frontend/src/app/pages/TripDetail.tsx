import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, Star, MapPin, Clock, Waves, Users, Calendar, 
  Shield, CheckCircle, AlertCircle, Phone, Mail 
} from "lucide-react";
import { useExperienceDetail } from "../features/catalog";
import { ReviewForm, useReviewSubmission } from "../features/reviews";
import { useAuth } from "../hooks/useAuth";

export function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const {
    addReview,
    averageRating: avgRating,
    center,
    error,
    experience: trip,
    loading,
    reviews: tripReviews,
    similarExperiences: similarTrips,
  } = useExperienceDetail("trip", id, token);
  const handleReviewSubmit = useReviewSubmission({
    token,
    target: "trip",
    targetId: Number(id),
    onCreated: addReview,
  });

  if (loading) {
    return <div className="flex items-center justify-center h-96 text-slate-400">Loading trip...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-96 text-red-500">{error}</div>;
  }

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-slate-400">Trip not found.</p>
        <button onClick={() => navigate("/trips")} className="text-teal-600 text-sm font-medium">
          ← Back to Trips
        </button>
      </div>
    );
  }

  const includedItems = trip.type === "course" 
    ? [
        "Full PADI certification materials",
        "All dive equipment rental",
        "Experienced instructor (max 4 students)",
        "Boat trips and site access",
        "Digital certification card",
      ]
    : [
        "Professional dive guide",
        "All dive equipment (BCD, regulator, wetsuit, mask, fins)",
        "Boat transportation to dive site",
        "Refreshments and water on board",
        "Dive insurance coverage",
      ];

  const whatToBring = [
    "Valid dive certification card (if applicable)",
    "Swimwear and towel",
    "Sunscreen (reef-safe)",
    "Camera (optional)",
    "Valid ID",
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] bg-slate-900">
        <img 
          src={trip.img} 
          alt={trip.title} 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        
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
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full inline-block mb-3 ${
              trip.type === "course" ? "bg-purple-500 text-white" : "bg-teal-500 text-white"
            }`}>
              {trip.type === "course" ? "Course" : "Trip"}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white tracking-wide mb-3">
              {trip.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <button 
                onClick={() => center && navigate(`/centers/${center.id}`)}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4" />
                {center ? `${center.name} · ${center.city}` : "Independent Instructor"}
              </button>
              {tripReviews.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{avgRating}</span>
                  <span className="text-white/70">({tripReviews.length} reviews)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Info */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <Clock className="w-5 h-5" />, label: "Duration", value: trip.duration },
                  { icon: <Waves className="w-5 h-5" />, label: "Depth", value: trip.depth },
                  { icon: <Users className="w-5 h-5" />, label: "Level", value: trip.level },
                  { icon: <Calendar className="w-5 h-5" />, label: "Date", value: trip.date },
                ].map((item) => (
                  <div key={item.label} className="text-center p-3 bg-slate-50 rounded-xl">
                    <div className="flex justify-center text-teal-500 mb-2">{item.icon}</div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide mb-4">
                ABOUT THIS {trip.type === "course" ? "COURSE" : "TRIP"}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">{trip.description}</p>
              <p className="text-slate-600 leading-relaxed">
                {trip.type === "course" 
                  ? "This comprehensive course will take you from beginner to certified diver. You'll learn essential skills in confined water before progressing to open water dives. Our experienced instructors ensure a safe, enjoyable learning experience."
                  : "Join us for an unforgettable underwater adventure. Our expert guides will lead you through pristine dive sites, ensuring both safety and maximum enjoyment. All experience levels are welcome, and we provide a thorough briefing before each dive."}
              </p>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide mb-4">
                WHAT'S INCLUDED
              </h2>
              <div className="space-y-2.5">
                {includedItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What to Bring */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide mb-4">
                WHAT TO BRING
              </h2>
              <div className="space-y-2.5">
                {whatToBring.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide">
                    REVIEWS
                  </h2>
                  {tripReviews.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-lg text-slate-900">{avgRating}</span>
                      </div>
                      <span className="text-slate-400 text-sm">· {tripReviews.length} review{tripReviews.length !== 1 ? "s" : ""}</span>
                    </div>
                  )}
                </div>
              </div>

              {tripReviews.length > 0 ? (
                <div className="space-y-5">
                  {tripReviews.map((review) => (
                    <div key={review.id} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-start gap-4">
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
                  <p className="text-slate-400">No reviews yet for this trip.</p>
                  <p className="text-slate-400 text-sm mt-1">Be the first to share your experience!</p>
                </div>
              )}

              <ReviewForm
                label={trip.title}
                onSubmit={handleReviewSubmit}
              />
            </div>

            {/* Similar Trips */}
            {similarTrips.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide mb-4">
                  SIMILAR TRIPS
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {similarTrips.map((t) => {
                    return (
                      <button
                        key={t.id}
                        onClick={() => navigate(`/trips/${t.id}`)}
                        className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-teal-200 hover:shadow-md transition-all text-left"
                      >
                        <div className="h-32 overflow-hidden">
                          <img src={t.img} alt={t.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            t.type === "course" ? "bg-purple-50 text-purple-700" : "bg-teal-50 text-teal-700"
                          }`}>
                            {t.type}
                          </span>
                          <h3 className="font-semibold text-slate-900 mt-2 line-clamp-2">{t.title}</h3>
                          <p className="text-xs text-slate-400 mt-1">{center?.city ?? "Oyster listing"}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-teal-600 font-bold">SAR {t.price}</span>
                            <span className="text-xs text-slate-400">{t.duration}</span>
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
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24 space-y-5">
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-display text-3xl font-bold text-teal-600">SAR {trip.price}</span>
                  <span className="text-slate-400 text-sm">/ person</span>
                </div>
                <p className="text-xs text-slate-400">{trip.slots} spots available</p>
              </div>

              <button 
                onClick={() => navigate(`/booking/trip/${trip.id}`)}
                className="w-full bg-teal-500 text-white font-semibold py-3.5 rounded-xl hover:bg-teal-600 transition-colors"
              >
                Book Now
              </button>

              <div className="border-t border-slate-100 pt-5 space-y-3">
                <h3 className="font-semibold text-slate-900 text-sm">Provided by</h3>
                <button 
                  onClick={() => center && navigate(`/centers/${center.id}`)}
                  className="flex items-center gap-3 w-full hover:bg-slate-50 rounded-xl p-2 -m-2 transition-colors"
                >
                  <img 
                    src={center?.img ?? trip.img} 
                    alt={center?.name ?? "Independent Instructor"} 
                    className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{center?.name ?? "Independent Instructor"}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {center?.verified && (
                        <Shield className="w-3 h-3 text-teal-500" />
                      )}
                      <span className="text-xs text-slate-400">{center?.city ?? "Instructor-owned listing"}</span>
                    </div>
                  </div>
                </button>

                {center && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-900">{center.rating}</span>
                    <span className="text-slate-400">({center.reviews} reviews)</span>
                  </div>
                )}
              </div>

              {center && (
                <div className="border-t border-slate-100 pt-5 space-y-2.5">
                  <a 
                    href={`tel:${center.phone}`}
                    className="flex items-center gap-3 text-slate-600 hover:text-teal-600 transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    {center.phone}
                  </a>
                  <a 
                    href={`mailto:${center.email}`}
                    className="flex items-center gap-3 text-slate-600 hover:text-teal-600 transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4" />
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
