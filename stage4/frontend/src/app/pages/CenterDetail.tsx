import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapPin, Star, Shield, Phone, Mail, Clock, Waves, Users, ArrowRight, ChevronLeft, Calendar } from "lucide-react";
import { type Center, type Review, type Trip } from "../data";
import { getCenterById } from "../lib/catalogService";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
      ))}
    </div>
  );
}

export function CenterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"trips" | "reviews">("trips");
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [submitted, setSubmitted] = useState(false);
  const [center, setCenter] = useState<Center | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
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

    getCenterById(centerId)
      .then((data) => {
        if (!active) return;
        setCenter(data.center);
        setTrips([...data.trips, ...data.courses]);
        setReviews(data.reviews);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load center.");
        setCenter(null);
        setTrips([]);
        setReviews([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-96 text-slate-400">Loading center...</div>;
  if (error) return <div className="flex items-center justify-center h-96 text-red-500">{error}</div>;
  if (!center) return <div className="flex items-center justify-center h-96 text-slate-400">Center not found.</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero image */}
      <div className="relative h-72 md:h-96 overflow-hidden bg-slate-200">
        <img src={center.img} alt={center.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button onClick={() => navigate("/centers")} className="absolute top-6 left-6 flex items-center gap-1.5 text-white/80 hover:text-white bg-black/30 backdrop-blur rounded-xl px-3 py-2 text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" /> All Centers
        </button>
        {center.verified && (
          <div className="absolute top-6 right-6 bg-teal-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow">
            <Shield className="w-3.5 h-3.5" /> Verified Center
          </div>
        )}
        <div className="absolute bottom-6 left-6">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white tracking-wide">{center.name}</h1>
          <p className="text-white/70 flex items-center gap-1 mt-1"><MapPin className="w-4 h-4 text-teal-400" />{center.address}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Rating summary */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="text-center">
                <p className="font-display text-5xl font-bold text-slate-900">{center.rating}</p>
                <StarRow rating={center.rating} />
                <p className="text-xs text-slate-400 mt-1">{center.reviews} reviews</p>
              </div>
              <div className="h-16 w-px bg-slate-100" />
              <div className="flex flex-wrap gap-2">
                {center.specialties.map((s) => (
                  <span key={s} className="text-sm bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-100">{s}</span>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide mb-3">About</h2>
              <p className="text-slate-600 leading-relaxed">{center.longDescription}</p>
            </div>

            {/* Gallery */}
            {center.gallery.length > 0 && (
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide mb-3">Gallery</h2>
                <div className="grid grid-cols-3 gap-3">
                  {center.gallery.map((img, i) => (
                    <div key={i} className="rounded-xl overflow-hidden h-32 bg-slate-100">
                      <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit">
              {(["trips", "reviews"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
                  {tab === "trips" ? `Trips & Courses (${trips.length})` : `Reviews (${reviews.length})`}
                </button>
              ))}
            </div>

            {/* Trips list */}
            {activeTab === "trips" && (
              <div className="space-y-4">
                {trips.length === 0 && <p className="text-slate-400 text-sm py-8 text-center">No trips listed yet.</p>}
                {trips.map((trip) => (
                  <div key={trip.id} className="flex gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-teal-200 transition-colors group">
                    <div className="w-24 h-20 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                      <img src={trip.img} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mr-2 ${trip.type === "course" ? "bg-purple-50 text-purple-700 border border-purple-100" : "bg-blue-50 text-blue-700 border border-blue-100"}`}>
                            {trip.type === "course" ? "Course" : "Trip"}
                          </span>
                          <h3 className="font-semibold text-slate-900 mt-1">{trip.title}</h3>
                        </div>
                        <p className="font-display text-xl font-bold text-teal-600 flex-shrink-0">SAR {trip.price}</p>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{trip.duration}</span>
                        <span className="flex items-center gap-1"><Waves className="w-3.5 h-3.5" />{trip.depth}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{trip.slots} spots</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{trip.date}</span>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/booking/${trip.id}`)}
                      className="self-center bg-teal-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-teal-600 transition-colors flex items-center gap-1 flex-shrink-0">
                      Book <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Reviews */}
            {activeTab === "reviews" && (
              <div className="space-y-5">
                {reviews.map((r) => (
                  <div key={r.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={r.avatar} alt={r.user} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow" />
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{r.user}</p>
                        <div className="flex items-center gap-2">
                          <StarRow rating={r.rating} />
                          <span className="text-xs text-slate-400">{r.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{r.comment}</p>
                  </div>
                ))}

                {/* Submit review */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 mt-6">
                  <h3 className="font-display text-xl font-bold text-slate-900 tracking-wide mb-4">Leave a Review</h3>
                  {submitted ? (
                    <p className="text-teal-600 font-medium text-sm">Thank you for your review!</p>
                  ) : (
                    <div className="space-y-3">
                      <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 bg-white" placeholder="Your name" value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">Rating:</span>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <button key={i} onClick={() => setReviewForm({ ...reviewForm, rating: i })}>
                            <Star className={`w-5 h-5 transition-colors ${i <= reviewForm.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 hover:text-amber-300"}`} />
                          </button>
                        ))}
                      </div>
                      <textarea rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 bg-white resize-none" placeholder="Share your experience..." value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} />
                      <button onClick={() => reviewForm.name && reviewForm.comment && setSubmitted(true)} disabled={!reviewForm.name || !reviewForm.comment} className="bg-teal-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-teal-600 transition-colors disabled:opacity-40 text-sm">
                        Submit Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Contact card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 sticky top-24">
              <h3 className="font-display text-xl font-bold text-slate-900 tracking-wide mb-4">Contact</h3>
              <div className="space-y-3">
                <a href={`tel:${center.phone}`} className="flex items-center gap-3 text-sm text-slate-700 hover:text-teal-600 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0"><Phone className="w-4 h-4 text-teal-600" /></div>
                  {center.phone}
                </a>
                <a href={`mailto:${center.email}`} className="flex items-center gap-3 text-sm text-slate-700 hover:text-teal-600 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0"><Mail className="w-4 h-4 text-teal-600" /></div>
                  {center.email}
                </a>
                <div className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5"><MapPin className="w-4 h-4 text-teal-600" /></div>
                  {center.address}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-500 space-y-1">
                <p>Operating since <span className="font-semibold text-slate-700">{center.since}</span></p>
                <p>Price range: <span className="font-semibold text-slate-700">{center.priceRange}</span></p>
              </div>
              <button onClick={() => trips[0] && navigate(`/booking/${trips[0].id}`)} className="w-full mt-5 bg-teal-500 text-white font-semibold py-3 rounded-xl hover:bg-teal-600 transition-colors text-sm">
                Book a Trip →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
