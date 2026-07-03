import { useNavigate } from "react-router-dom";
import { Anchor, Shield, Users, MapPin, CheckCircle, ArrowRight } from "lucide-react";

export function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative h-72 md:h-96 overflow-hidden bg-slate-200">
        <img
          src="https://images.unsplash.com/photo-1682687981630-cefe9cd73072?w=1600&h=600&fit=crop&auto=format"
          alt="Divers underwater"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-10 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-teal-300 text-sm font-medium tracking-widest uppercase mb-2">Who we are</p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white tracking-wide">ABOUT OYSTER</h1>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-teal-600 text-sm font-medium tracking-widest uppercase mb-3">Our Mission</p>
            <h2 className="font-display text-4xl font-bold text-slate-900 tracking-wide leading-tight mb-5">
              CONNECTING DIVERS<br />WITH THE KINGDOM'S<br />BEST WATERS.
            </h2>
            <p className="text-slate-500 leading-relaxed mb-4">
              Oyster is Saudi Arabia's first dedicated diving platform, built to connect passionate divers with certified dive centers across the Kingdom's stunning coastlines — from the vibrant Red Sea reefs of Jeddah and Yanbu to the unique pearl-diving heritage of the Arabian Gulf.
            </p>
            <p className="text-slate-500 leading-relaxed">
              We believe that every diver — beginner or expert — deserves access to safe, verified, and memorable underwater experiences. Our platform makes it simple to discover, book, and review dive trips and training courses, all in one place.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden h-80 bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1682687982298-c7514a167088?w=700&h=500&fit=crop&auto=format"
              alt="Diver over coral reef"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-teal-600 py-14">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "8", label: "Certified Centers" },
            { value: "6", label: "Saudi Cities" },
            { value: "15+", label: "Trips & Courses" },
            { value: "2026", label: "Founded" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-5xl font-bold text-white">{s.value}</p>
              <p className="text-teal-100 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-teal-600 text-sm font-medium tracking-widest uppercase mb-2">What we stand for</p>
            <h2 className="font-display text-4xl font-bold text-slate-900 tracking-wide">OUR VALUES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-6 h-6" />, title: "Safety First", desc: "Every dive center on Oyster is manually verified. We check certifications, equipment standards, and safety records before listing." },
              { icon: <Users className="w-6 h-6" />, title: "Community Driven", desc: "Real reviews from real divers. Our ratings system keeps centers accountable and helps you make informed decisions." },
              { icon: <MapPin className="w-6 h-6" />, title: "Local Expertise", desc: "We focus exclusively on Saudi Arabia, giving us deep knowledge of local dive sites, conditions, and regulations." },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-4">
                  {v.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 tracking-wide mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-teal-600 text-sm font-medium tracking-widest uppercase mb-2">The people behind Oyster</p>
            <h2 className="font-display text-4xl font-bold text-slate-900 tracking-wide">OUR TEAM</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Abdullah Al-Ghamdi", role: "Co-Founder & CEO", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format", bio: "Certified PADI instructor with 12 years of diving experience across the Red Sea." },
              { name: "Sara Al-Mutairi", role: "Co-Founder & COO", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format", bio: "Former tourism director with a passion for sustainable marine experiences." },
              { name: "Faisal Al-Dosari", role: "Head of Partnerships", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&auto=format", bio: "Builds relationships with dive centers from Jizan to NEOM across the Kingdom." },
            ].map((m) => (
              <div key={m.name} className="text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-lg">
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base">{m.name}</h3>
                <p className="text-teal-600 text-sm font-medium mb-2">{m.role}</p>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-teal-600 text-sm font-medium tracking-widest uppercase mb-3">Why Oyster</p>
            <h2 className="font-display text-4xl font-bold text-slate-900 tracking-wide leading-tight mb-6">
              THE TRUSTED PLATFORM<br />FOR SAUDI DIVERS.
            </h2>
            <ul className="space-y-4">
              {[
                "All centers verified by our team before listing",
                "Secure online booking with instant confirmation",
                "Trips and courses for every level — beginner to technical",
                "Honest reviews from a real diving community",
                "Dedicated support for both divers and operators",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-teal-600" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative rounded-2xl overflow-hidden h-80 bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1682687982167-d7fb3ed8541d?w=700&h=500&fit=crop&auto=format"
              alt="Underwater cave diving"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-600 py-14">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Anchor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-white tracking-wide">READY TO DIVE IN?</h2>
              <p className="text-teal-100 text-sm mt-1">Browse centers and book your next underwater adventure.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/centers")} className="bg-white text-teal-600 font-bold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm flex items-center gap-2">
              Browse Centers <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate("/center/dashboard")} className="border border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm">
              List Your Center
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
