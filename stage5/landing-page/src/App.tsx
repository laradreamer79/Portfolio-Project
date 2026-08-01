import {
  Anchor,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Github,
  Mail,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Waves,
} from "lucide-react";

const APP_URL = "https://zeroyster.onrender.com";
const REPOSITORY_URL = "https://github.com/laradreamer79/Portfolio-Project";
const CONTACT_EMAIL = "Laradreamer79@gmail.com";
const WHATSAPP_NUMBER = "966543889380";

const cities = [
  ["Jeddah", "https://images.unsplash.com/photo-1682687982298-c7514a167088?w=600&h=420&fit=crop&auto=format"],
  ["Yanbu", "https://images.unsplash.com/photo-1682687982167-d7fb3ed8541d?w=600&h=420&fit=crop&auto=format"],
  ["Dammam", "https://images.unsplash.com/photo-1708649290066-5f617003b93f?w=600&h=420&fit=crop&auto=format"],
  ["Khobar", "https://images.unsplash.com/photo-1573553467420-b2a90be8d317?w=600&h=420&fit=crop&auto=format"],
  ["NEOM", "https://images.unsplash.com/photo-1682687981630-cefe9cd73072?w=600&h=420&fit=crop&auto=format"],
  ["Jazan", "https://images.unsplash.com/photo-1682687981922-7b55dbb30892?w=600&h=420&fit=crop&auto=format"],
];

const features = [
  {
    title: "Browse Centers",
    description: "Find certified diving centers across Saudi Arabia and compare their diving experiences.",
    image: "https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=900&h=520&fit=crop&auto=format",
    icon: <Search />,
  },
  {
    title: "Dive Trips",
    description: "Explore guided dive trips, choose the right date, and reserve your place online.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&h=520&fit=crop&auto=format",
    icon: <Waves />,
  },
  {
    title: "Training Courses",
    description: "Discover courses for beginners and advanced divers, all in one platform.",
    image: "https://images.unsplash.com/photo-1682687982167-d7fb3ed8541d?w=900&h=520&fit=crop&auto=format",
    icon: <BookOpen />,
  },
];

const team = [
  ["Lara Alzannan", "Project Manager"],
  ["Ebtihal Alomari", "Frontend Developer"],
  ["Maryam Alessa", "Backend Developer"],
  ["Solaf Alessa", "Backend Developer"],
];

function App() {
  return (
    <div>
      <header className="navbar">
        <a className="brand" href="#top" aria-label="Oyster home">
          <span className="brand-icon"><Anchor size={17} /></span>
          <span>Oyster</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#top">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About Us</a>
          <a href="#team">Team</a>
        </nav>
        <a className="signin" href={`${APP_URL}/auth`}>Sign In</a>
      </header>

      <main id="top">
        <section className="hero">
          <img src="https://images.unsplash.com/photo-1682687982298-c7514a167088?w=1600&h=900&fit=crop&auto=format" alt="Scuba diver over a Saudi Red Sea coral reef" />
          <div className="hero-overlay" />
          <div className="content hero-content">
            <h1>DISCOVER THE<br /><span>RED SEA.</span></h1>
            <p className="eyebrow">Saudi Arabia&apos;s Diving Platform</p>
            <p className="hero-copy">Browse certified diving centers across the Kingdom. Book trips, courses, and experiences — all in one place.</p>
            <a className="search-bar" href={`${APP_URL}/centers`}>
              <Search size={18} />
              <span>Search by city or center name...</span>
              <strong>Find Centers</strong>
            </a>
          </div>
        </section>

        <section className="section white">
          <div className="content">
            <div className="section-heading split">
              <div><p className="eyebrow teal">Dive destinations</p><h2>BROWSE BY CITY</h2></div>
              <a href={`${APP_URL}/catalog`}>All trips &amp; courses <ArrowRight size={16} /></a>
            </div>
            <div className="city-grid">
              {cities.map(([city, image]) => <a className="city" href={`${APP_URL}/catalog?city=${city}`} key={city}><img src={image} alt={city} /><span>{city}</span></a>)}
            </div>
          </div>
        </section>

        <section id="features" className="section muted">
          <div className="content">
            <div className="section-heading"><p className="eyebrow teal">Everything in one place</p><h2>EXPLORE OYSTER</h2><p className="subcopy">Three simple ways Oyster helps divers discover their next underwater experience.</p></div>
            <div className="feature-grid">
              {features.map((feature) => <article className="feature-card" key={feature.title}><img src={feature.image} alt="" /><div><span className="feature-icon">{feature.icon}</span><h3>{feature.title}</h3><p>{feature.description}</p></div></article>)}
            </div>
          </div>
        </section>

        <section className="section white">
          <div className="content">
            <div className="center"><p className="eyebrow teal">Simple process</p><h2>HOW IT WORKS</h2></div>
            <div className="steps">
              {[ ["01", <Search />, "Browse Centers", "Explore certified diving centers across Saudi Arabia's coasts."], ["02", <Waves />, "Choose Your Dive", "Pick from trips and courses for every level of experience."], ["03", <CheckCircle />, "Book & Dive", "Open Oyster, choose your experience, and start your dive." ]].map(([number, icon, title, text]) => <article className="step" key={String(number)}><b>{number}</b><span>{icon}</span><h3>{title}</h3><p>{text}</p></article>)}
            </div>
          </div>
        </section>

        <section id="team" className="section muted">
          <div className="content"><div className="section-heading center"><p className="eyebrow teal">The people behind Oyster</p><h2>OUR TEAM</h2><p className="subcopy">Oyster was created as a portfolio project to make discovering diving experiences simpler.</p></div><div className="team-grid">{team.map(([name, role]) => <article key={name}><span>{name.charAt(0)}</span><h3>{name}</h3><p>{role}</p></article>)}</div></div>
        </section>

        <section id="about" className="why">
          <img src="https://images.unsplash.com/photo-1573553467420-b2a90be8d317?w=1600&h=700&fit=crop&auto=format" alt="Divers below the sea" />
          <div className="why-overlay" />
          <div className="content why-content">
            <div><p className="eyebrow">Why Oyster</p><h2>EXPLORE.<br />EXPERIENCE.<br /><span>REMEMBER.</span></h2><p>Oyster brings Saudi Arabia&apos;s diving centers, trips, courses, and bookings together in one clear place for divers.</p><a className="primary" href={APP_URL}>Open Oyster <ArrowRight size={17} /></a></div>
            <div className="stats"><div><b>7</b><span><ShieldCheck size={17} /> Certified Centers</span></div><div><b>6</b><span><MapPin size={17} /> Saudi Cities</span></div><div><b>15</b><span><Waves size={17} /> Trips &amp; Courses</span></div><div><b>100%</b><span><CheckCircle size={17} /> Verified Operators</span></div></div>
          </div>
        </section>

        <section className="contact-section">
          <div className="content">
            <div>
              <p className="eyebrow"><Mail size={18} /> Contact Us</p>
              <h2>LET&apos;S TALK DIVING</h2>
              <p>Have a question about centers, trips, courses, or bookings?<br />Our team is here to help you.</p>
            </div>
            <div className="contact-buttons">
              <a className="open-app-button" href={APP_URL}>Open Oyster <ArrowRight size={17} /></a>
              <a className="email-button" href={`mailto:${CONTACT_EMAIL}`}><Mail size={17} /> Email Us</a>
              <a className="whatsapp-button" href={`https://wa.me/${WHATSAPP_NUMBER}`}><MessageCircle size={17} /> WhatsApp</a>
            </div>
          </div>
        </section>
      </main>

      <footer><div className="content footer-top"><div><a className="brand" href="#top"><span className="brand-icon"><Anchor size={15} /></span><span>Oyster</span></a><p>Saudi Arabia&apos;s premier diving platform. Connect with certified centers across the Kingdom.</p></div><div className="footer-links"><a href={`${APP_URL}/centers`}>Browse Centers</a><a href={`${APP_URL}/trips`}>Dive Trips</a><a href={`${APP_URL}/courses`}>Courses</a><a href={`${APP_URL}/about`}>About</a><a href={REPOSITORY_URL}><Github size={14} /> GitHub</a></div></div><div className="content footer-bottom"><span>© 2026 Oyster. All rights reserved.</span><span>Dive Saudi Arabia.</span></div></footer>
    </div>
  );
}

export default App;
