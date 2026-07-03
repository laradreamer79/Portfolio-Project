export const CITIES = ["All Cities", "Jeddah", "Yanbu", "Dammam", "Al Khobar", "NEOM", "Jizan"];

export type Center = {
  id: number;
  name: string;
  city: string;
  description: string;
  longDescription: string;
  priceRange: string;
  rating: number;
  reviews: number;
  phone: string;
  email: string;
  address: string;
  img: string;
  gallery: string[];
  verified: boolean;
  since: number;
  specialties: string[];
};

export type Trip = {
  id: number;
  centerId: number;
  title: string;
  type: "trip" | "course";
  level: string;
  price: number;
  duration: string;
  depth: string;
  date: string;
  slots: number;
  description: string;
  img: string;
};

export type Review = {
  id: number;
  centerId: number;
  tripId?: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
};

export const CENTERS: Center[] = [
  {
    id: 1,
    name: "Red Sea Divers Jeddah",
    city: "Jeddah",
    description: "Premier dive center on the Jeddah Corniche with full equipment rental and PADI courses.",
    longDescription: "Red Sea Divers Jeddah has been operating since 2008, offering world-class diving experiences along Saudi Arabia's stunning Red Sea coast. Our fleet of five boats departs daily from the Jeddah Corniche marina. We specialize in coral reef dives, wreck exploration, and night dives. Our certified instructors speak Arabic, English, and Tagalog.",
    priceRange: "SAR 250–600",
    rating: 4.8,
    reviews: 214,
    phone: "+966 12 345 6789",
    email: "info@redseadivers.sa",
    address: "Corniche Road, North Jeddah, Saudi Arabia",
    img: "https://images.unsplash.com/photo-1682687982298-c7514a167088?w=700&h=480&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1682687982167-d7fb3ed8541d?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1682687981630-cefe9cd73072?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1682687981907-170c006e3744?w=600&h=400&fit=crop&auto=format",
    ],
    verified: true,
    since: 2008,
    specialties: ["Reef Dives", "Wreck Dives", "Night Dives", "PADI Courses"],
  },
  {
    id: 2,
    name: "Aqua Arabia Diving",
    city: "Jeddah",
    description: "Family-friendly dive center offering beginner packages and coral reef snorkeling tours.",
    longDescription: "Aqua Arabia Diving is Jeddah's most family-friendly dive operation. We run small group sizes (max 6 per instructor) to ensure personalized attention. Our beginner 'Discover Scuba' program has introduced over 3,000 people to the underwater world. We also offer private photography dives for underwater enthusiasts.",
    priceRange: "SAR 180–450",
    rating: 4.6,
    reviews: 139,
    phone: "+966 12 456 7890",
    email: "hello@aquaarabia.sa",
    address: "Al Hamra District, Jeddah, Saudi Arabia",
    img: "https://images.unsplash.com/photo-1682687982360-3fbab65f9d50?w=700&h=480&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1708649290066-5f617003b93f?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1573553467420-b2a90be8d317?w=600&h=400&fit=crop&auto=format",
    ],
    verified: true,
    since: 2015,
    specialties: ["Beginner Packages", "Snorkeling", "Underwater Photography", "Family Dives"],
  },
  {
    id: 3,
    name: "Yanbu Dive Club",
    city: "Yanbu",
    description: "Explore the pristine untouched reefs of Yanbu — one of the Red Sea's best-kept secrets.",
    longDescription: "Yanbu Dive Club operates from Yanbu Al Bahr, giving access to some of the most pristine and least-dived coral reefs in the Red Sea. With significantly less boat traffic than Jeddah, visibility here routinely exceeds 30 meters. We run liveaboard trips to remote sites and day trips to the famous Seven Sisters reef system.",
    priceRange: "SAR 300–800",
    rating: 4.9,
    reviews: 87,
    phone: "+966 14 321 0987",
    email: "dive@yanbucluib.sa",
    address: "Yanbu Al Bahr Marina, Yanbu, Saudi Arabia",
    img: "https://images.unsplash.com/photo-1682687982167-d7fb3ed8541d?w=700&h=480&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1682687981922-7b55dbb30892?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1682687981630-cefe9cd73072?w=600&h=400&fit=crop&auto=format",
    ],
    verified: true,
    since: 2012,
    specialties: ["Liveaboard", "Remote Reefs", "Advanced Dives", "Marine Life"],
  },
  {
    id: 4,
    name: "Gulf Divers Dammam",
    city: "Dammam",
    description: "The Arabian Gulf's premier dive operator offering unique rocky reef and pearl diving experiences.",
    longDescription: "Gulf Divers Dammam brings you the unique marine environment of the Arabian Gulf — different from the Red Sea, with rocky reefs, pearl oyster beds, and rich fish life adapted to warmer waters. We are the only center in the region offering guided historical pearl diving cultural experiences alongside modern scuba.",
    priceRange: "SAR 200–500",
    rating: 4.5,
    reviews: 102,
    phone: "+966 13 567 8901",
    email: "info@gulfdivers.sa",
    address: "King Fahd Causeway Area, Dammam, Saudi Arabia",
    img: "https://images.unsplash.com/photo-1708649290066-5f617003b93f?w=700&h=480&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1682687982298-c7514a167088?w=600&h=400&fit=crop&auto=format",
    ],
    verified: true,
    since: 2010,
    specialties: ["Pearl Diving", "Rocky Reefs", "Gulf Marine Life", "Cultural Experiences"],
  },
  {
    id: 5,
    name: "Khobar Sea Sports",
    city: "Al Khobar",
    description: "Al Khobar's leading water sports and diving center on the Arabian Gulf coast.",
    longDescription: "Khobar Sea Sports combines professional diving with a full water sports offering. Our dive team runs daily boat trips to the best sites in the Arabian Gulf, including the famous Al Arabiyah oil platform artificial reef, which has become home to a thriving ecosystem of fish and corals over 40 years.",
    priceRange: "SAR 220–480",
    rating: 4.4,
    reviews: 76,
    phone: "+966 13 678 9012",
    email: "dive@khobarsea.sa",
    address: "Al Khobar Waterfront, Al Khobar, Saudi Arabia",
    img: "https://images.unsplash.com/photo-1573553467420-b2a90be8d317?w=700&h=480&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1682687981907-170c006e3744?w=600&h=400&fit=crop&auto=format",
    ],
    verified: false,
    since: 2018,
    specialties: ["Artificial Reefs", "Water Sports", "Gulf Dives", "Beginner Friendly"],
  },
  {
    id: 6,
    name: "NEOM Blue Diving",
    city: "NEOM",
    description: "Cutting-edge dive center at NEOM with access to pristine northern Red Sea reef systems.",
    longDescription: "NEOM Blue Diving is the first and only dive operator based within the NEOM development zone, giving exclusive access to the northern Red Sea's most spectacular and remote reef systems. Crystal-clear water with 40m+ visibility, abundant megafauna including whale sharks, and almost zero dive traffic make this the most exclusive diving in Saudi Arabia.",
    priceRange: "SAR 500–1,500",
    rating: 5.0,
    reviews: 41,
    phone: "+966 50 789 0123",
    email: "dive@neomblue.sa",
    address: "NEOM Bay, Tabuk Region, Saudi Arabia",
    img: "https://images.unsplash.com/photo-1682687982360-3fbab65f9d50?w=700&h=480&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1682687981630-cefe9cd73072?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1682687982167-d7fb3ed8541d?w=600&h=400&fit=crop&auto=format",
    ],
    verified: true,
    since: 2023,
    specialties: ["Whale Sharks", "Remote Reefs", "Luxury Diving", "Technical Diving"],
  },
  {
    id: 7,
    name: "Jizan Coral Divers",
    city: "Jizan",
    description: "Southern Red Sea specialists with access to Farasan Islands — one of Arabia's richest marine reserves.",
    longDescription: "Jizan Coral Divers is the gateway to the Farasan Islands Marine Sanctuary, one of the most biodiverse marine environments in the Red Sea. As one of only two operators licensed to dive within the sanctuary, we offer exclusive access to untouched reefs, nesting sea turtles, and ancient coral formations that have never seen a dive boat.",
    priceRange: "SAR 350–900",
    rating: 4.7,
    reviews: 63,
    phone: "+966 17 890 1234",
    email: "info@jizancoral.sa",
    address: "Jizan Marina, Jizan, Saudi Arabia",
    img: "https://images.unsplash.com/photo-1682687981922-7b55dbb30892?w=700&h=480&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1708649290066-5f617003b93f?w=600&h=400&fit=crop&auto=format",
    ],
    verified: true,
    since: 2016,
    specialties: ["Marine Reserve", "Sea Turtles", "Remote Islands", "Conservation"],
  },
  {
    id: 8,
    name: "Yanbu Technical Diving",
    city: "Yanbu",
    description: "Saudi Arabia's only technical diving center, specializing in deep dives and trimix training.",
    longDescription: "Yanbu Technical Diving is the only center in Saudi Arabia offering full technical diving training and operations. We run courses from Advanced Nitrox through CCR Instructor level. Our technical dive sites include deep wrecks to 60m and wall dives that drop beyond recreational limits into pristine deep-water environments.",
    priceRange: "SAR 600–2,000",
    rating: 4.8,
    reviews: 34,
    phone: "+966 14 432 1098",
    email: "tech@yanbutech.sa",
    address: "Yanbu Industrial City, Yanbu, Saudi Arabia",
    img: "https://images.unsplash.com/photo-1573553467420-b2a90be8d317?w=700&h=480&fit=crop&auto=format",
    gallery: [],
    verified: true,
    since: 2019,
    specialties: ["Technical Diving", "Deep Dives", "Trimix", "CCR"],
  },
];

export const TRIPS: Trip[] = [
  { id: 1, centerId: 1, title: "Abu Madafi Reef Day Trip", type: "trip", level: "Open Water", price: 320, duration: "Full Day", depth: "10–25m", date: "Jul 15, 2026", slots: 8, description: "Explore the famous Abu Madafi reef system — one of Jeddah's most celebrated coral gardens.", img: "https://images.unsplash.com/photo-1682687982298-c7514a167088?w=500&h=340&fit=crop&auto=format" },
  { id: 2, centerId: 1, title: "Jeddah Night Dive", type: "trip", level: "Advanced", price: 280, duration: "Evening", depth: "8–18m", date: "Jul 18, 2026", slots: 6, description: "Experience the Red Sea after dark — hunting octopus, lobster, and glowing plankton.", img: "https://images.unsplash.com/photo-1682687982360-3fbab65f9d50?w=500&h=340&fit=crop&auto=format" },
  { id: 3, centerId: 1, title: "PADI Open Water Course", type: "course", level: "Beginner", price: 1800, duration: "4 Days", depth: "0–18m", date: "Jul 20, 2026", slots: 4, description: "Get your PADI Open Water certification in Jeddah's warm Red Sea waters.", img: "https://images.unsplash.com/photo-1682687981630-cefe9cd73072?w=500&h=340&fit=crop&auto=format" },
  { id: 4, centerId: 2, title: "Discover Scuba — First Dive", type: "course", level: "Beginner", price: 250, duration: "Half Day", depth: "0–6m", date: "Jul 14, 2026", slots: 10, description: "Your first underwater experience in a safe, guided environment. No experience needed.", img: "https://images.unsplash.com/photo-1708649290066-5f617003b93f?w=500&h=340&fit=crop&auto=format" },
  { id: 5, centerId: 2, title: "Family Reef Snorkeling Tour", type: "trip", level: "Beginner", price: 180, duration: "3 Hours", depth: "0–4m", date: "Jul 16, 2026", slots: 12, description: "A gentle snorkeling tour over shallow coral gardens. Suitable for all ages from 6+.", img: "https://images.unsplash.com/photo-1682687981907-170c006e3744?w=500&h=340&fit=crop&auto=format" },
  { id: 6, centerId: 3, title: "Seven Sisters Reef Expedition", type: "trip", level: "Intermediate", price: 450, duration: "Full Day", depth: "15–30m", date: "Jul 22, 2026", slots: 5, description: "The legendary Seven Sisters reef system — 7 pinnacles teeming with reef sharks and giant tuna.", img: "https://images.unsplash.com/photo-1682687982167-d7fb3ed8541d?w=500&h=340&fit=crop&auto=format" },
  { id: 7, centerId: 3, title: "Yanbu Liveaboard — 3 Days", type: "trip", level: "Advanced", price: 2200, duration: "3 Days", depth: "10–40m", date: "Aug 1, 2026", slots: 8, description: "Three days aboard our 18m vessel exploring Yanbu's remote northern reefs. All meals included.", img: "https://images.unsplash.com/photo-1682687981922-7b55dbb30892?w=500&h=340&fit=crop&auto=format" },
  { id: 8, centerId: 4, title: "Pearl Diving Cultural Experience", type: "trip", level: "Beginner", price: 350, duration: "Half Day", depth: "3–8m", date: "Jul 17, 2026", slots: 8, description: "Dive the same waters where Saudi pearl divers have worked for centuries. Includes cultural presentation.", img: "https://images.unsplash.com/photo-1573553467420-b2a90be8d317?w=500&h=340&fit=crop&auto=format" },
  { id: 9, centerId: 5, title: "Arabiyah Platform Reef Dive", type: "trip", level: "Open Water", price: 290, duration: "Full Day", depth: "12–22m", date: "Jul 19, 2026", slots: 6, description: "Dive an extraordinary artificial reef that has grown around a decommissioned oil platform over 40 years.", img: "https://images.unsplash.com/photo-1682687981630-cefe9cd73072?w=500&h=340&fit=crop&auto=format" },
  { id: 10, centerId: 6, title: "NEOM Whale Shark Safari", type: "trip", level: "Open Water", price: 1200, duration: "Full Day", depth: "5–20m", date: "Aug 5, 2026", slots: 4, description: "Swim alongside whale sharks in NEOM's exclusive northern reef territories. Guaranteed sightings in season.", img: "https://images.unsplash.com/photo-1682687982298-c7514a167088?w=500&h=340&fit=crop&auto=format" },
  { id: 11, centerId: 6, title: "NEOM Technical Deep Dive", type: "trip", level: "Advanced", price: 1500, duration: "Full Day", depth: "30–50m", date: "Aug 8, 2026", slots: 3, description: "Access NEOM's exclusive deep wall sites, dropping to 50m in crystal-clear northern Red Sea water.", img: "https://images.unsplash.com/photo-1682687981907-170c006e3744?w=500&h=340&fit=crop&auto=format" },
  { id: 12, centerId: 7, title: "Farasan Islands Marine Reserve", type: "trip", level: "Intermediate", price: 650, duration: "Full Day", depth: "8–28m", date: "Aug 12, 2026", slots: 6, description: "Licensed access to the Farasan Islands Marine Sanctuary — one of the most protected and biodiverse reefs in Arabia.", img: "https://images.unsplash.com/photo-1708649290066-5f617003b93f?w=500&h=340&fit=crop&auto=format" },
  { id: 13, centerId: 7, title: "Sea Turtle Nesting Site Dive", type: "trip", level: "Open Water", price: 420, duration: "Full Day", depth: "5–15m", date: "Aug 15, 2026", slots: 8, description: "Dive alongside nesting green sea turtles at a protected beach site in the Farasan archipelago.", img: "https://images.unsplash.com/photo-1682687982167-d7fb3ed8541d?w=500&h=340&fit=crop&auto=format" },
  { id: 14, centerId: 8, title: "Advanced Nitrox Course", type: "course", level: "Advanced", price: 2800, duration: "3 Days", depth: "0–40m", date: "Aug 3, 2026", slots: 3, description: "Become a certified Nitrox diver and extend your bottom time on deeper dives.", img: "https://images.unsplash.com/photo-1682687981922-7b55dbb30892?w=500&h=340&fit=crop&auto=format" },
  { id: 15, centerId: 8, title: "Deep Wreck Dive — 55m", type: "trip", level: "Advanced", price: 900, duration: "Full Day", depth: "40–55m", date: "Aug 10, 2026", slots: 4, description: "Technical dive to a WWII-era wreck sitting at 55m. Requires Advanced or Technical certification.", img: "https://images.unsplash.com/photo-1573553467420-b2a90be8d317?w=500&h=340&fit=crop&auto=format" },
];

export const REVIEWS: Review[] = [
  { id: 1, centerId: 1, user: "Mohammed Al-Rashid", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&auto=format", rating: 5, date: "Jun 2026", comment: "Best diving experience I've had in Saudi Arabia. The instructors were incredibly professional and the reef was stunning. Will absolutely return!" },
  { id: 2, centerId: 1, user: "Sarah Thompson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&auto=format", rating: 5, date: "May 2026", comment: "Completed my PADI Open Water here. The teaching was patient and thorough. The Red Sea is absolutely breathtaking." },
  { id: 3, centerId: 1, user: "Khalid bin Faisal", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&auto=format", rating: 4, date: "May 2026", comment: "Great equipment and knowledgeable guides. The Abu Madafi reef site is genuinely world-class. Only minor issue was the boat was a bit crowded." },
  { id: 4, centerId: 2, user: "Fatima Al-Zahra", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&auto=format", rating: 5, date: "Jun 2026", comment: "Took my kids for the family snorkel tour. They absolutely loved it. The guide was wonderful with children. Highly recommended for families!" },
  { id: 5, centerId: 3, user: "James Wilson", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&auto=format", rating: 5, date: "Jun 2026", comment: "The Seven Sisters dive was the highlight of my year. Visibility was 35 meters, reef sharks everywhere. Yanbu is a hidden gem." },
  { id: 6, centerId: 6, user: "Nora Al-Qahtani", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60&h=60&fit=crop&auto=format", rating: 5, date: "May 2026", comment: "NEOM Blue is unlike anything else in the region. Premium everything — boat, equipment, guides. The whale sharks were unforgettable." },
  
  // Trip-specific reviews
  { id: 7, centerId: 1, tripId: 1, user: "Ahmed Al-Dosari", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop&auto=format", rating: 5, date: "Jun 2026", comment: "Abu Madafi reef exceeded all expectations! The coral gardens were absolutely stunning. Saw Napoleon wrasse and a huge school of barracuda. Highly recommend!" },
  { id: 8, centerId: 1, tripId: 1, user: "Lisa Chen", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&auto=format", rating: 5, date: "May 2026", comment: "Perfect dive trip. The crew was professional, the reef was pristine, and visibility was excellent. This is a must-do when in Jeddah." },
  { id: 9, centerId: 1, tripId: 2, user: "Omar Khalil", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&auto=format", rating: 5, date: "Jun 2026", comment: "Night diving at its finest! Spotted several octopus hunting and the bioluminescent plankton was magical. An unforgettable experience." },
  { id: 10, centerId: 3, tripId: 6, user: "Rachel Foster", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&auto=format", rating: 5, date: "Jun 2026", comment: "Seven Sisters is legendary for a reason. Multiple reef sharks, huge tuna, incredible coral formations. Best dive of my life!" },
  { id: 11, centerId: 6, tripId: 10, user: "Abdullah Al-Harbi", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&auto=format", rating: 5, date: "May 2026", comment: "Swimming with whale sharks in NEOM was a dream come true. We saw 4 individuals! Premium service from start to finish. Worth every riyal." },
  { id: 12, centerId: 6, tripId: 10, user: "Emily Watson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&auto=format", rating: 5, date: "May 2026", comment: "Absolutely incredible experience. The whale sharks were gentle giants and the water clarity was unreal. NEOM Blue runs a world-class operation." },
];