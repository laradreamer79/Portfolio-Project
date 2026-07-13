import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Search, Waves, Award } from "lucide-react";
import { CITIES, type Center, type Trip } from "../data";
import { CenterCard } from "../components/cards/CenterCard";
import { ExperienceCard } from "../components/cards/ExperienceCard";
import { getCenters, getCourses, getTrips } from "../lib/catalogService";

const CITY_IMGS: Record<string, string> = {
  Jeddah: "https://images.unsplash.com/photo-1682687982298-c7514a167088?w=600&h=420&fit=crop&auto=format",
  Yanbu: "https://images.unsplash.com/photo-1682687982167-d7fb3ed8541d?w=600&h=420&fit=crop&auto=format",
  Dammam: "https://images.unsplash.com/photo-1708649290066-5f617003b93f?w=600&h=420&fit=crop&auto=format",
  "Al Khobar": "https://images.unsplash.com/photo-1573553467420-b2a90be8d317?w=600&h=420&fit=crop&auto=format",
  NEOM: "https://images.unsplash.com/photo-1682687981630-cefe9cd73072?w=600&h=420&fit=crop&auto=format",
  Jizan: "https://images.unsplash.com/photo-1682687981922-7b55dbb30892?w=600&h=420&fit=crop&auto=format",
};

export function Home() {
  const navigate = useNavigate();
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
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load featured catalog data.");
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

  const featured = centers.filter((c) => c.verified).slice(0, 3);
  const cities = CITIES.filter((c) => c !== "All Cities");
  const featuredTrips = trips.slice(0, 3);
  const featuredCourses = courses.slice(0, 3);
  const centerCount = centers.length || "—";
  const cityCount = new Set(centers.map((center) => center.city)).size || cities.length;
  const listingCount = trips.length + courses.length || "—";
  const experienceCountForCity = (city: string) => {
    const centerIds = new Set(
      centers
        .filter((center) => center.city === city)
        .map((center) => center.id),
    );

    return [...trips, ...courses].filter(
      (experience) =>
        experience.centerId !== undefined &&
        experience.centerId !== null &&
        centerIds.has(experience.centerId),
    ).length;
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[540px] flex flex-col justify-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1682687982298-c7514a167088?w=1600&h=900&fit=crop&auto=format" alt="Scuba diver over Saudi Red Sea coral reef" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="relative max-w-7xl mx-auto px-6 w-full pb-16">
          <p className="text-teal-300 text-sm font-medium tracking-[0.2em] uppercase mb-3">Saudi Arabia's Diving Platform</p>
          <h1 className="font-display text-6xl md:text-8xl font-bold text-white leading-none tracking-wide mb-4">
            DISCOVER THE<br /><span className="text-teal-400">RED SEA.</span>
          </h1>
          <p className="text-white/70 text-lg max-w-lg mb-8">Browse certified diving centers across the Kingdom. Book trips, courses, and experiences — all in one place.</p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-1 bg-white rounded-2xl px-4 py-3 shadow-xl">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input className="flex-1 text-sm text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent" placeholder="Search by city or center name..." />
            </div>
            <button onClick={() => navigate("/centers")} className="bg-teal-500 text-white font-semibold px-8 py-3 rounded-2xl hover:bg-teal-600 transition-colors text-sm whitespace-nowrap shadow-xl">Find Centers</button>
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="text-teal-600 text-sm font-medium tracking-widest uppercase mb-1">Dive destinations</p>
              <h2 className="font-display text-4xl font-bold text-slate-900 tracking-wide">BROWSE BY CITY</h2>
            </div>
            <button onClick={() => navigate("/catalog")} className="text-sm text-teal-600 font-medium hover:text-teal-700 flex items-center gap-1 transition-colors">All trips & courses <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cities.map((city) => (
              <button key={city} onClick={() => navigate(`/catalog?city=${encodeURIComponent(city)}`)} className="group relative rounded-2xl overflow-hidden h-40 bg-slate-100 cursor-pointer text-left">
                <img src={CITY_IMGS[city]} alt={city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-display text-lg font-bold text-white tracking-wide leading-tight">{city}</p>
                  <p className="text-teal-300 text-xs">
                    {experienceCountForCity(city)} trips & courses
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Centers */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="text-teal-600 text-sm font-medium tracking-widest uppercase mb-1">Top rated</p>
              <h2 className="font-display text-4xl font-bold text-slate-900 tracking-wide">FEATURED CENTERS</h2>
            </div>
            <button onClick={() => navigate("/centers")} className="text-sm text-teal-600 font-medium hover:text-teal-700 flex items-center gap-1">View all <ArrowRight className="w-4 h-4" /></button>
          </div>
          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading && (
              <div className="col-span-3 text-center py-12 text-slate-400">
                Loading featured centers...
              </div>
            )}
            {!loading && featured.map((center) => (
              <CenterCard
                key={center.id}
                center={center}
                variant="featured"
                onSelect={(selectedCenter) => navigate(`/centers/${selectedCenter.id}`)}
              />
            ))}
            {!loading && featured.length === 0 && (
              <div className="col-span-3 text-center py-12 text-slate-400">
                No featured centers yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Trips */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="text-teal-600 text-sm font-medium tracking-widest uppercase mb-1">Get in the water</p>
              <h2 className="font-display text-4xl font-bold text-slate-900 tracking-wide">FEATURED DIVE TRIPS</h2>
            </div>
            <button onClick={() => navigate("/trips")} className="text-sm text-teal-600 font-medium hover:text-teal-700 flex items-center gap-1">All trips <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {loading && (
              <div className="col-span-3 text-center py-12 text-slate-400">
                Loading featured trips...
              </div>
            )}
            {!loading && featuredTrips.map((trip) => {
              const center = centers.find((c) => c.id === trip.centerId);
              return (
                <ExperienceCard
                  key={trip.id}
                  experience={trip}
                  center={center}
                  variant="featured"
                  onOpen={(selectedTrip) => navigate(`/trips/${selectedTrip.id}`)}
                  onBook={(selectedTrip) => navigate(`/booking/${selectedTrip.type}/${selectedTrip.id}`)}
                  onCenterSelect={(selectedCenter) => navigate(`/centers/${selectedCenter.id}`)}
                />
              );
            })}
            {!loading && featuredTrips.length === 0 && (
              <div className="col-span-3 text-center py-12 text-slate-400">
                No featured trips yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="text-purple-600 text-sm font-medium tracking-widest uppercase mb-1">Learn to dive</p>
              <h2 className="font-display text-4xl font-bold text-slate-900 tracking-wide">TRAINING COURSES</h2>
            </div>
            <button onClick={() => navigate("/courses")} className="text-sm text-purple-600 font-medium hover:text-purple-700 flex items-center gap-1">All courses <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {loading && (
              <div className="col-span-3 text-center py-12 text-slate-400">
                Loading featured courses...
              </div>
            )}
            {!loading && featuredCourses.map((course) => {
              const center = centers.find((c) => c.id === course.centerId);
              return (
                <ExperienceCard
                  key={course.id}
                  experience={course}
                  center={center}
                  variant="featured"
                  onOpen={(selectedCourse) => navigate(`/courses/${selectedCourse.id}`)}
                  onBook={(selectedCourse) => navigate(`/booking/${selectedCourse.type}/${selectedCourse.id}`)}
                  onCenterSelect={(selectedCenter) => navigate(`/centers/${selectedCenter.id}`)}
                />
              );
            })}
            {!loading && featuredCourses.length === 0 && (
              <div className="col-span-3 text-center py-12 text-slate-400">
                No featured courses yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-teal-600 text-sm font-medium tracking-widest uppercase mb-2">Simple process</p>
            <h2 className="font-display text-4xl font-bold text-slate-900 tracking-wide">HOW IT WORKS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Search className="w-6 h-6" />, num: "01", title: "Browse Centers", desc: "Explore certified diving centers across Saudi Arabia's Red Sea and Arabian Gulf coasts." },
              { icon: <Waves className="w-6 h-6" />, num: "02", title: "Choose Your Dive", desc: "Pick from hundreds of trips and courses — from beginner reef dives to advanced technical expeditions." },
              { icon: <CheckCircle className="w-6 h-6" />, num: "03", title: "Book & Dive", desc: "Submit your booking request online. The center confirms your spot and you show up ready to dive." },
            ].map((s) => (
              <div key={s.num} className="relative text-center p-8 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="font-display text-7xl font-bold text-slate-100 absolute top-4 right-5 select-none leading-none">{s.num}</div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mx-auto mb-4">{s.icon}</div>
                <h3 className="font-display text-2xl font-bold text-slate-900 tracking-wide mb-3">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore / Experience / Remember */}
      <section className="relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1573553467420-b2a90be8d317?w=1600&h=700&fit=crop&auto=format" alt="Diver exploring an underwater shipwreck" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-teal-400 text-sm font-medium tracking-widest uppercase mb-4">Why Oyster</p>
            <h2 className="font-display text-6xl md:text-7xl font-bold text-white tracking-wide leading-none mb-6">
              EXPLORE.<br />EXPERIENCE.<br /><span className="text-teal-400">REMEMBER.</span>
            </h2>
            <p className="text-white/60 leading-relaxed mb-8 max-w-md">From your first open-water dive to advanced technical expeditions, Oyster connects you with certified dive centers across Saudi Arabia's stunning coastlines.</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { num: String(centerCount), label: "Certified Centers" },
                { num: String(cityCount), label: "Saudi Cities" },
                { num: String(listingCount), label: "Trips & Courses" },
                { num: "100%", label: "Verified Operators" },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur border border-white/10 rounded-xl p-4">
                  <p className="font-display text-3xl font-bold text-teal-400">{s.num}</p>
                  <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate("/trips")} className="bg-teal-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal-600 transition-colors flex items-center gap-2 text-sm">
                Browse Trips <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate("/about")} className="border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm">
                About Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Operator CTA */}
      <section className="bg-teal-600 py-14">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-teal-200" />
              <span className="text-teal-200 text-sm font-medium uppercase tracking-widest">For Dive Centers</span>
            </div>
            <h2 className="font-display text-4xl font-bold text-white tracking-wide">LIST YOUR CENTER ON OYSTER</h2>
            <p className="text-teal-100 mt-2 max-w-lg">Reach divers across Saudi Arabia and beyond. Manage bookings, reviews, and your trip calendar — all in one dashboard.</p>
          </div>
          <button onClick={() => navigate("/center/dashboard")} className="bg-white text-teal-600 font-bold px-8 py-3.5 rounded-xl hover:bg-teal-50 transition-colors whitespace-nowrap text-sm flex-shrink-0 shadow-lg">
            Open Center Portal →
          </button>
        </div>
      </section>
    </div>
  );
}
