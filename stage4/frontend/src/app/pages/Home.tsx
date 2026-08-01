import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  ArrowRight,
  Award,
  CheckCircle,
  Mail,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Waves,
} from "lucide-react";
import {
  CenterCard,
  ExperienceCard,
  useFeaturedCatalog,
} from "../features/catalog";

const CITY_IMGS: Record<string, string> = {
  Jeddah: "https://images.unsplash.com/photo-1682687982298-c7514a167088?w=600&h=420&fit=crop&auto=format",
  Yanbu: "https://images.unsplash.com/photo-1682687982167-d7fb3ed8541d?w=600&h=420&fit=crop&auto=format",
  Dammam: "https://images.unsplash.com/photo-1708649290066-5f617003b93f?w=600&h=420&fit=crop&auto=format",
  "Khobar": "https://images.unsplash.com/photo-1573553467420-b2a90be8d317?w=600&h=420&fit=crop&auto=format",
  NEOM: "https://images.unsplash.com/photo-1682687981630-cefe9cd73072?w=600&h=420&fit=crop&auto=format",
  Jazan: "https://images.unsplash.com/photo-1682687981922-7b55dbb30892?w=600&h=420&fit=crop&auto=format",
};

const WHATSAPP_NUMBER = "966543889380";

export function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    centerCount,
    centers,
    cities,
    cityCount,
    error,
    experienceCountForCity,
    featuredCenters: featured,
    featuredCourses,
    featuredTrips,
    listingCount,
    loading,
  } = useFeaturedCatalog();

  function handleSearch(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/centers?search=${encodeURIComponent(query)}` : "/centers");
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[540px] flex flex-col justify-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1682687982298-c7514a167088?w=1600&h=900&fit=crop&auto=format" alt="Scuba diver over Saudi Red Sea coral reef" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="relative max-w-7xl mx-auto px-6 w-full pb-35">
          <h1 className="mb-5 font-display text-6xl font-bold leading-none tracking-wide text-white md:text-8xl">
            DISCOVER THE<br /><span className="text-teal-400">RED SEA.</span>
          </h1>

          <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-teal-300">
            Saudi Arabia&apos;s Diving Platform
          </p>

          <form
            onSubmit={handleSearch}
            className="flex max-w-2xl flex-col gap-4 sm:flex-row"
          >
            <div className="flex items-center gap-2 flex-1 bg-white rounded-2xl px-4 py-3 shadow-xl">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="search"
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                placeholder="Search by city or center name..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <button type="submit" className="bg-teal-500 text-white font-semibold px-8 py-3 rounded-2xl hover:bg-teal-600 transition-colors text-sm whitespace-nowrap shadow-xl">Find Centers</button>
          </form>
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/65" />
        <div className="relative mx-auto grid max-w-7xl items-start gap-12 px-6 py-20 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-6 md:py-24">
          <div className="order-2 w-full md:order-2 md:justify-self-stretch">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-teal-300">Oyster at a glance</p>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { num: String(centerCount), label: "Certified Centers", icon: <Award className="h-5 w-5" /> },
                { num: String(cityCount), label: "Saudi Cities", icon: <MapPin className="h-5 w-5" /> },
                { num: String(listingCount), label: "Trips & Courses", icon: <Anchor className="h-5 w-5" /> },
                { num: "100%", label: "Verified Operators", icon: <ShieldCheck className="h-5 w-5" /> },
              ].map((s) => (
                <div
                  key={s.label}
                  className="group relative min-h-36 overflow-hidden rounded-2xl border border-white/15 bg-slate-950/45 p-5 shadow-xl backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-teal-300/40 hover:bg-slate-900/65"
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-teal-400/10 blur-2xl transition group-hover:bg-teal-400/20" />
                  <div className="relative flex items-start justify-between gap-3">
                    <p className="font-display text-4xl font-bold leading-none text-teal-300">{s.num}</p>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-300/20 bg-teal-400/10 text-teal-200">
                      {s.icon}
                    </span>
                  </div>
                  <p className="absolute bottom-5 left-5 right-5 text-sm font-medium text-white/75">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 max-w-lg md:order-1 md:justify-self-start">
            <div className="mb-5">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-300">Why Oyster</p>
            </div>
            <h2 className="mb-6 font-display text-5xl font-bold leading-[0.9] tracking-wide text-white md:text-7xl">
              EXPLORE.<br />EXPERIENCE.<br /><span className="text-teal-400">REMEMBER.</span>
            </h2>
            <p className="mb-8 max-w-md text-lg leading-relaxed text-white/75">From your first open-water dive to advanced technical expeditions, Oyster connects you with certified dive centers across Saudi Arabia&apos;s stunning coastlines.</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate("/trips")} className="flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition hover:-translate-y-0.5 hover:bg-teal-400">
                Browse Trips <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate("/about")} className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10">
                About Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-teal-600 py-9">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Mail className="h-5 w-5 text-teal-200" />
              <span className="text-sm font-medium uppercase tracking-widest text-teal-200">
                Contact Us
              </span>
            </div>

            <h2 className="font-display text-4xl font-bold tracking-wide text-white">
              LET&apos;S TALK DIVING
            </h2>

            <p className="mt-2 max-w-xl text-teal-100">
              Have a question about centers, trips, courses, or bookings?
              <br />
              Our team is here to help you.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
