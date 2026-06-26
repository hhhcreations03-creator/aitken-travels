// ─── Vehicle / Fleet Types ──────────────────────────────────────

export interface Vehicle {
  id: string;
  name: string;
  category: string;
  seats: number;
  luggage: string;
  image: string;
  pricePerDay: number;
  pricePerKm: number;
  features: string[];
  description: string;
  ac: boolean;
  transmission: string;
}

export interface Service {
  id: string;
  title: string;
  meta: string;
  image: string;
  blurb: string;
  details: {
    description: string;
    features: string[];
    routes?: string[];
    pricing?: string;
  };
}

export interface Region {
  id: string;
  name: string;
  x: number;
  y: number;
  blurb: string;
  tag: string;
  image: string;
  highlights?: string[];
  bestTime?: string;
  distance?: string;
}

export interface Testimonial {
  name: string;
  from: string;
  trip: string;
  quote: string;
  avatar: string;
  rating: number;
  highlights: string[];
}

export interface Story {
  id: string;
  title: string;
  meta: string;
  image: string;
}

export interface Offer {
  tag: string;
  title: string;
  sub: string;
  accent: "terracotta" | "gold";
}

// ─── Fleet Data ─────────────────────────────────────────────────
// All images: local files in /public/fleet/

export const VEHICLES: Vehicle[] = [
  {
    id: "sedan-car",
    name: "Sedan Cars",
    category: "Sedan",
    seats: 3,
    luggage: "2 large bags",
    image: "/fleet/sedan.jpg",
    pricePerDay: 65,
    pricePerKm: 0.30,
    features: ["Air conditioned", "Automatic", "Bluetooth audio", "USB charging", "Bottled water"],
    description: "A comfortable and economical sedan perfect for couples or solo travellers. Ideal for Colombo city transfers, airport pickups, and day trips to Kandy or Galle.",
    ac: true,
    transmission: "Automatic",
  },
  {
    id: "luxury-sedan",
    name: "Luxury Sedan Cars",
    category: "Luxury Sedan",
    seats: 3,
    luggage: "3 large bags",
    image: "/fleet/luxury-sedan.jpeg",
    pricePerDay: 150,
    pricePerKm: 0.60,
    features: ["Air conditioned", "Leather seats", "Premium sound system", "Wi-Fi", "Rear privacy glass", "Complimentary refreshments"],
    description: "Premium executive sedan for VIP transfers, corporate clients, and special occasions. Travel in style from the airport to Colombo\u2019s finest hotels.",
    ac: true,
    transmission: "Automatic",
  },
  {
    id: "high-roof-van",
    name: "High Roof Vans",
    category: "High Roof Van",
    seats: 10,
    luggage: "8 large bags",
    image: "/fleet/high-roof-van.png",
    pricePerDay: 130,
    pricePerKm: 0.55,
    features: ["Air conditioned", "High-roof cabin", "Reclining seats", "PA system", "Overhead storage", "USB charging"],
    description: "Extra headroom and spacious interior for larger groups touring the Cultural Triangle. Stand-up entry and generous luggage space for the Colombo\u2013Jaffna route.",
    ac: true,
    transmission: "Manual",
  },
  {
    id: "flat-roof-van",
    name: "Flat Roof Vans",
    category: "Flat Roof Van",
    seats: 8,
    luggage: "6 large bags",
    image: "/fleet/flat-roof-van.jpg",
    pricePerDay: 110,
    pricePerKm: 0.50,
    features: ["Air conditioned", "Spacious cabin", "Reclining seats", "PA system", "Large luggage area", "USB charging"],
    description: "The workhorse of Sri Lankan travel. Compact profile for narrow hill-country roads yet spacious inside for families exploring Sigiriya, Ella, and the south coast.",
    ac: true,
    transmission: "Manual",
  },
  {
    id: "rosa-bus",
    name: "Rosa Buses",
    category: "Rosa Bus",
    seats: 28,
    luggage: "Undercarriage storage",
    image: "/fleet/rosa-bus.png",
    pricePerDay: 200,
    pricePerKm: 0.75,
    features: ["Air conditioned", "Reclining seats", "PA system", "Overhead bins", "Large luggage bay", "Curtained windows"],
    description: "Ideal for tour groups visiting Anuradhapura, Polonnaruwa, and Dambulla. Comfortable seating, ample luggage space, and smooth highway performance.",
    ac: true,
    transmission: "Manual",
  },
  {
    id: "luxury-coach",
    name: "Luxury Coach Buses",
    category: "Luxury Coach",
    seats: 45,
    luggage: "Large undercarriage bay",
    image: "/fleet/luxury-coach.jpg",
    pricePerDay: 350,
    pricePerKm: 1.00,
    features: ["Air conditioned", "Push-back seats", "Onboard entertainment", "Wi-Fi", "Restroom", "Luggage bay", "Microphone"],
    description: "Premium coach for large groups, corporate outings to Bentota, and wedding parties. Full amenities for long-distance comfort across Sri Lanka.",
    ac: true,
    transmission: "Automatic",
  },
  {
    id: "scooter",
    name: "Scooters",
    category: "Scooter",
    seats: 2,
    luggage: "Under-seat storage",
    image: "/fleet/scooter.png",
    pricePerDay: 15,
    pricePerKm: 0,
    features: ["Self-ride rental", "Available for 2 riders", "Automatic scooter", "Helmets included", "Under-seat storage", "Fuel efficient"],
    description: "Explore Mirissa, Unawatuna, and the southern coast on two wheels. Perfect for couples beach-hopping and navigating busy coastal towns at your own pace.",
    ac: false,
    transmission: "Automatic",
  },
  {
    id: "royal-enfield",
    name: "Royal Enfield Motorbikes",
    category: "Royal Enfield",
    seats: 2,
    luggage: "Saddlebag optional",
    image: "/fleet/royal-enfield.jpg",
    pricePerDay: 35,
    pricePerKm: 0,
    features: ["Self-ride rental", "Available for 2 riders", "Manual motorcycle", "Helmets included", "Saddlebag available", "Classic riding experience"],
    description: "The iconic touring motorcycle. Built for winding hill-country roads from Kandy to Nuwara Eliya and the open southern expressway to Galle. Ride at your own pace.",
    ac: false,
    transmission: "Manual",
  },
  {
    id: "tuk-tuk",
    name: "Tuk-Tuks",
    category: "Tuk-Tuk",
    seats: 3,
    luggage: "Small bags only",
    image: "/fleet/tuk-tuk.png",
    pricePerDay: 20,
    pricePerKm: 0,
    features: ["Self-ride rental", "Available for 3 riders", "Standard & Cabrio/Convertible options", "Iconic Sri Lankan three-wheeler", "Easy to drive", "Perfect for city exploration", "Fuel efficient"],
    description: "The quintessential Sri Lankan experience. Choose from our standard tuk-tuks or upgrade to a Cabrio/Convertible tuk-tuk for an open-air ride with panoramic views. Navigate Colombo\u2019s bustling streets, cruise coastal roads from Galle to Mirissa, or explore local villages like a true islander. No trip to Sri Lanka is complete without a tuk-tuk adventure.",
    ac: false,
    transmission: "Manual",
  },
];

// ─── Services ───────────────────────────────────────────────────
// All images visually verified — confirmed authentic Sri Lanka photos

export const SERVICES: Service[] = [
  {
    id: "airport-transfers",
    title: "Airport Transfers",
    meta: "24/7 service",
    image: "/services/airport-transfers.jpg",
    blurb: "Reliable pickup and drop-off at Bandaranaike International Airport (CMB). Meet-and-greet, flight tracking, and door-to-door comfort to Colombo, Negombo, or beyond.",
    details: {
      description: "Start or end your Sri Lanka trip stress-free. Our professional drivers monitor your flight in real time and are always waiting at the arrivals hall \u2014 even if your flight is delayed. We provide meet-and-greet service with a name board, cold towels, and bottled water.",
      features: [
        "Real-time flight tracking \u2014 no extra charge for delays",
        "Meet-and-greet at arrivals with name board",
        "Cold towels and complimentary bottled water",
        "Available 24/7 including holidays",
        "Cars, vans, and buses for any group size",
        "Fixed pricing \u2014 no surge or hidden fees",
      ],
      routes: ["Airport \u2192 Colombo (35 km, ~1 hr)", "Airport \u2192 Negombo (10 km, ~20 min)", "Airport \u2192 Kandy (115 km, ~3 hrs)", "Airport \u2192 Galle (155 km, ~2.5 hrs)", "Airport \u2192 Sigiriya (170 km, ~4 hrs)"],
      pricing: "From $35 for airport to Colombo. Prices vary by destination and vehicle type.",
    },
  },
  {
    id: "round-tours",
    title: "Round Island Tours",
    meta: "Multi-day",
    image: "/services/round-tours.jpg",
    blurb: "Multi-day guided tours with experienced drivers. Sigiriya, Kandy, Ella, Yala, Galle \u2014 experience the entire island at your pace, with our wheels.",
    details: {
      description: "Explore the best of Sri Lanka with a dedicated driver who knows every road, shortcut, and hidden gem on the island. Our round tours are fully customizable \u2014 you set the pace, choose the stops, and we handle all the driving and logistics.",
      features: [
        "Dedicated English-speaking driver for the entire trip",
        "Fully customizable itinerary \u2014 your pace, your stops",
        "Air-conditioned vehicles with Wi-Fi and USB charging",
        "Driver doubles as a local guide with insider knowledge",
        "Hotel pickup and drop-off at every stop",
        "All fuel, tolls, and driver accommodation included",
      ],
      routes: ["Cultural Triangle: Sigiriya, Dambulla, Polonnaruwa (3\u20134 days)", "Hill Country: Kandy, Nuwara Eliya, Ella (3\u20135 days)", "Southern Coast: Galle, Mirissa, Tangalle (2\u20133 days)", "Full Island: Colombo to Jaffna and back (7\u201310 days)", "Wildlife Circuit: Yala, Udawalawe, Wilpattu (4\u20135 days)"],
      pricing: "From $65/day for a car, $110/day for a van. All-inclusive pricing with no hidden costs.",
    },
  },
  {
    id: "self-drive",
    title: "Vehicle Rentals",
    meta: "Cars, bikes & tuk-tuks",
    image: "/services/self-drive.jpg",
    blurb: "Rent a car, motorbike, or tuk-tuk and explore Sri Lanka on your own terms. All rentals come with insurance, roadside assistance, and flexible pickup across the island.",
    details: {
      description: "Sri Lanka is best explored at your own pace. Choose from our range of well-maintained rental vehicles \u2014 sedans and SUVs for highway comfort, Royal Enfield motorcycles for scenic hill-country rides, scooters for coastal beach-hopping, or the iconic Sri Lankan tuk-tuk for the ultimate local experience. Every rental includes comprehensive insurance, a GPS device, and 24/7 roadside assistance so you can focus on the adventure. Foreign nationals require a Temporary Driving Licence \u2014 we handle the entire application process for you through the AAC (Automobile Association of Ceylon).",
      features: [
        "Sedan cars, SUVs, and vans for families and groups",
        "Royal Enfield motorcycles and Honda scooters available",
        "Tuk-tuk rentals \u2014 the iconic Sri Lankan three-wheeler",
        "Comprehensive insurance included with every rental",
        "GPS navigation and phone mount provided free",
        "24/7 roadside assistance island-wide",
        "Flexible pickup and drop-off \u2014 Colombo, airport, Galle, Kandy",
        "No mileage limits on multi-day rentals",
        "Temporary Driving Licence assistance \u2014 we handle the paperwork",
      ],
      routes: ["Colombo \u2192 Galle via Southern Expressway (scenic coastal route)", "Kandy \u2192 Nuwara Eliya \u2192 Ella (winding mountain roads, best by car or bike)", "Galle \u2192 Mirissa \u2192 Tangalle (coastal cruise, perfect for tuk-tuk)", "Negombo \u2192 Anuradhapura \u2192 Sigiriya (Cultural Triangle loop)", "Colombo city exploration by tuk-tuk (temples, markets, street food)"],
      pricing: "Tuk-tuks from $20/day. Scooters from $15/day. Cars from $45/day. Royal Enfield from $35/day. Weekly discounts available. Note regarding License: While we process the license for you, the AAC (Automobile Association of Ceylon) charges a $42 fee which is added during booking.",
    },
  },
  {
    id: "day-trips",
    title: "Day Excursions",
    meta: "Popular routes",
    // Sigiriya Lion Rock from distance with lush green jungle, Sri Lanka
    image: "https://images.unsplash.com/photo-1663784025074-49e9e7f11f62?w=900&q=80&fm=webp",
    blurb: "Half-day and full-day trips from Colombo to Kandy, Galle, or Pinnawala. Driver-guided with local insights and hidden gems.",
    details: {
      description: "Short on time? Our day excursions let you experience Sri Lanka\u2019s highlights in a single day. A knowledgeable driver picks you up from your hotel, takes you to the destination, guides you through the must-sees, and brings you back \u2014 all in one seamless trip.",
      features: [
        "Door-to-door service from your hotel",
        "Experienced driver with local knowledge",
        "Flexible departure times \u2014 early bird or late start",
        "Half-day (4\u20135 hrs) and full-day (8\u201310 hrs) options",
        "Entrance tickets and lunch can be arranged",
        "Air-conditioned vehicle with water provided",
      ],
      routes: ["Colombo \u2192 Galle Fort & southern beaches (full day)", "Colombo \u2192 Kandy & Temple of the Tooth (full day)", "Colombo \u2192 Pinnawala Elephant Orphanage (half day)", "Kandy \u2192 Nuwara Eliya tea country (full day)", "Ella \u2192 Nine Arch Bridge & Ravana Falls (half day)"],
      pricing: "Half-day trips from $40. Full-day excursions from $65. Prices include vehicle, fuel, and driver.",
    },
  },
];

// ─── Destinations / Route Map ───────────────────────────────────

export const REGIONS: Region[] = [
  { id: "jaffna", name: "Jaffna", x: 50, y: 8, tag: "North", image: "https://images.unsplash.com/photo-1725680968792-c8dce6d6cf18?w=600&q=80&fm=webp", blurb: "Sri Lanka\u2019s northern peninsula is a treasure trove of Tamil culture and Hindu heritage. The magnificent Nallur Kandaswamy Kovil, with its towering golden gopuram, is one of the most significant Hindu temples on the island and comes alive during the annual Nallur Festival. Nearby, the 17th-century Jaffna Fort \u2014 built by the Portuguese and later expanded by the Dutch \u2014 overlooks the lagoon. Don\u2019t miss the Jaffna Public Library, one of Asia\u2019s finest, and the pristine white sands of Casuarina Beach on Karainagar Island, a short drive across the causeway.", highlights: ["Nallur Kandaswamy Kovil", "Jaffna Fort (Dutch-Portuguese)", "Casuarina Beach, Karainagar", "Jaffna Public Library", "Nagadeepa Purana Viharaya", "Delft Island day trip"], bestTime: "Mar \u2013 Sep", distance: "400 km from Colombo" },
  { id: "trincomalee", name: "Trincomalee", x: 68, y: 22, tag: "East Coast", image: "https://images.unsplash.com/photo-1552055568-f8c4fb8c6320?w=600&q=80&fm=webp", blurb: "Trincomalee sits on one of the world\u2019s finest natural harbours, where the Indian Ocean meets ancient sacred sites. The Koneswaram Temple perches dramatically on Swami Rock \u2014 a clifftop shrine with panoramic ocean views and a history stretching back over 2,000 years. Just offshore, Pigeon Island National Park offers some of the best snorkelling in Sri Lanka with vibrant coral reefs and blacktip reef sharks. Nilaveli and Uppuveli beaches provide miles of unspoiled golden sand, far quieter than the south coast. Between June and September, you can spot blue whales and spinner dolphins on boat trips from the harbour.", highlights: ["Koneswaram Temple on Swami Rock", "Pigeon Island snorkelling & coral", "Nilaveli Beach (5 km stretch)", "Whale watching (Jun\u2013Sep)", "Marble Beach", "Fort Frederick"], bestTime: "Apr \u2013 Sep", distance: "260 km from Colombo" },
  { id: "wilpattu", name: "Wilpattu", x: 32, y: 28, tag: "Wildlife", image: "https://images.unsplash.com/photo-1680967462466-aa9321bd5fce?w=600&q=80&fm=webp", blurb: "Wilpattu is Sri Lanka\u2019s largest national park at over 1,300 square kilometres, and its oldest, dating back to 1905. Unlike Yala\u2019s dry scrubland, Wilpattu is defined by dense jungle and unique natural lakes called \u2018villus\u2019 \u2014 sand-rimmed depressions that fill with rainwater and attract wildlife at their edges. The park is one of the top spots for Sri Lankan leopard sightings, along with sloth bears, spotted deer, wild boar, and over 30 species of water birds. Ancient ruins within the park, including the old city of Pomparippu, add a historical dimension to your safari.", highlights: ["Leopard tracking at dawn/dusk", "Sloth bear sightings", "Villu (natural lake) ecosystems", "Pomparippu ancient ruins", "Over 30 water bird species", "Less crowded than Yala"], bestTime: "Feb \u2013 Oct", distance: "180 km from Colombo" },
  { id: "anuradhapura", name: "Anuradhapura", x: 44, y: 30, tag: "Heritage", image: "https://images.unsplash.com/photo-1663403764000-f927ff20fcbb?w=600&q=80&fm=webp", blurb: "Anuradhapura was Sri Lanka\u2019s first great capital, founded in the 4th century BC and serving as the seat of Sinhalese kings for over 1,400 years. Today, this UNESCO World Heritage Site spans over 40 square kilometres of ancient ruins, towering brick dagobas, and sacred temples. The Sri Maha Bodhi \u2014 a sacred fig tree grown from a cutting of the original Bodhi tree under which Buddha attained enlightenment \u2014 has been tended continuously for over 2,300 years, making it the oldest documented tree in the world. The white Ruwanwelisaya Dagoba rises 103 metres and remains one of the world\u2019s largest ancient structures. Best explored by bicycle over a full day.", highlights: ["Sri Maha Bodhi (oldest tree)", "Ruwanwelisaya Dagoba", "Jetavanaramaya (103m tall)", "Isurumuniya rock temple carvings", "Thuparamaya (oldest dagoba)", "Twin Ponds (Kuttam Pokuna)"], bestTime: "Year-round", distance: "200 km from Colombo" },
  { id: "sigiriya", name: "Sigiriya", x: 56, y: 36, tag: "Iconic", image: "https://images.unsplash.com/photo-1663784025074-49e9e7f11f62?w=600&q=80&fm=webp", blurb: "Sigiriya \u2014 the Lion Rock \u2014 is Sri Lanka\u2019s most iconic landmark and a UNESCO World Heritage Site. This 200-metre-tall rock fortress was built in the 5th century by King Kashyapa as both a palace and an impregnable citadel. The climb takes you past the famous Mirror Wall with 1,500-year-old graffiti, a gallery of exquisite frescoes depicting celestial maidens, and the massive lion paw carvings that once formed the entrance. At the summit, the remains of the royal palace complex offer breathtaking 360-degree views over endless jungle. For an even more spectacular perspective, climb nearby Pidurangala Rock at sunrise \u2014 the view of Sigiriya bathed in golden light is unforgettable.", highlights: ["Climb the rock fortress (1,200 steps)", "Ancient frescoes gallery", "Mirror Wall inscriptions", "Lion paw entrance carvings", "Summit palace ruins & views", "Pidurangala sunrise panorama"], bestTime: "Year-round", distance: "170 km from Colombo" },
  { id: "kandy", name: "Kandy", x: 56, y: 50, tag: "Cultural", image: "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?w=600&q=80&fm=webp", blurb: "Kandy was the last royal capital of Sri Lanka before British colonisation in 1815, and remains the cultural heart of the island. The Temple of the Sacred Tooth Relic (Sri Dalada Maligawa) houses what is believed to be a tooth of the Buddha \u2014 Sri Lanka\u2019s most venerated religious relic. Every evening, the Puja ceremony draws hundreds of devotees and visitors. The Royal Botanical Gardens at Peradeniya, founded in 1821, cover 147 acres with orchid houses, an avenue of royal palms, and a giant Javan fig tree. The drive from Colombo to Kandy through the Kadugannawa Pass is itself a scenic highlight, and traditional Kandyan dance performances in the evening provide a vivid cultural experience.", highlights: ["Temple of the Sacred Tooth Relic", "Royal Botanical Gardens (147 acres)", "Kandyan dance performance", "Kandy Lake evening walk", "Bahiravokanda Buddha statue", "Kadugannawa Pass scenic drive"], bestTime: "Jan \u2013 Apr", distance: "115 km from Colombo" },
  { id: "nuwaraeliya", name: "Nuwara Eliya", x: 58, y: 58, tag: "Tea Country", image: "https://images.unsplash.com/photo-1544451822-38e32b887c08?w=600&q=80&fm=webp", blurb: "Perched at 1,868 metres above sea level, Nuwara Eliya is known as \u2018Little England\u2019 for its cool climate and colonial-era architecture. This is the heart of Ceylon tea country \u2014 endless rolling plantations of emerald green stretch across the hillsides, and a visit to a working tea factory reveals the craft behind one of the world\u2019s finest exports. Gregory Lake offers paddle boating surrounded by mist-covered hills. Nearby Horton Plains National Park features the dramatic World\u2019s End cliff with a 870-metre vertical drop and Baker\u2019s Falls. The scenic train ride from Kandy through tea country to Nuwara Eliya is one of the most beautiful rail journeys on earth.", highlights: ["Ceylon tea factory tours & tasting", "Gregory Lake boating", "Horton Plains & World\u2019s End", "Victoria Park gardens", "Pedro Tea Estate", "Scenic train from Kandy"], bestTime: "Mar \u2013 May", distance: "180 km from Colombo" },
  { id: "ella", name: "Ella", x: 64, y: 64, tag: "Hill Country", image: "https://images.unsplash.com/photo-1578519050142-afb511e518de?w=600&q=80&fm=webp", blurb: "Ella is a small mountain town that has captured the hearts of travellers worldwide. The Nine Arch Bridge \u2014 a colonial-era railway viaduct set among lush jungle \u2014 is one of Sri Lanka\u2019s most photographed landmarks, especially when the blue train crosses it. Little Adam\u2019s Peak offers a moderate sunrise hike with panoramic valley views, while Ravana Falls cascades 25 metres beside the main road. The train ride from Ella to Kandy (or vice versa) is consistently rated among the world\u2019s most scenic rail journeys, winding through tea plantations, over bridges, and through tunnels carved in the 1860s. The town itself is a laid-back haven with excellent cafes, cooking classes, and a cool mountain climate.", highlights: ["Nine Arch Bridge (train crossing)", "Little Adam\u2019s Peak sunrise hike", "Ravana Falls (25m cascade)", "Ella\u2013Kandy scenic train ride", "Ella Rock full-day hike", "Cooking classes & local cafes"], bestTime: "Jan \u2013 Mar", distance: "200 km from Colombo" },
  { id: "yala", name: "Yala", x: 70, y: 76, tag: "Wildlife", image: "https://images.unsplash.com/photo-1743014118271-415197f9b0ef?w=600&q=80&fm=webp", blurb: "Yala National Park holds the distinction of having the world\u2019s highest density of leopards per square kilometre. Located in the southeast, the park covers nearly 1,000 square kilometres of dry-zone forest, scrubland, and coastal lagoons. Early morning safaris offer the best chances of spotting the elusive Sri Lankan leopard, along with herds of wild elephants, crocodiles basking on riverbanks, wild boar, and over 215 bird species including rare endemics. The ancient Sithulpawwa rock temple within the park adds cultural depth to the wildlife experience. Block 1, closest to the entrance, is the most popular zone and offers the highest leopard sighting rate.", highlights: ["Sri Lankan leopard sightings", "Wild elephant herds", "Sithulpawwa rock temple", "Over 215 bird species", "Coastal lagoon ecosystem", "Block 1 dawn safari (best odds)"], bestTime: "Feb \u2013 Jul", distance: "300 km from Colombo" },
  { id: "bentota", name: "Bentota", x: 36, y: 78, tag: "Beach Resort", image: "https://images.unsplash.com/photo-1619531103472-7cc0d6479b59?w=600&q=80&fm=webp", blurb: "Bentota is Sri Lanka\u2019s most polished beach resort destination, just 65 kilometres south of Colombo along the Southern Expressway. The wide golden beach is backed by luxury hotels including Vivanta, Centara, and Taj, making it a favourite for honeymooners and families seeking comfort. The Bentota Ganga river offers boat safaris through mangrove-lined waterways where you can spot monitor lizards, kingfishers, and even crocodiles. Nearby, the Kosgoda Turtle Hatchery protects five of the world\u2019s seven sea turtle species. Brief Garden \u2014 the private estate of renowned Sri Lankan architect Geoffrey Bawa \u2014 is a must-visit for design enthusiasts, with its carefully curated tropical gardens and art collection.", highlights: ["Bentota Beach (golden sand)", "Bentota Ganga river safari", "Kosgoda Turtle Hatchery", "Brief Garden (Geoffrey Bawa)", "Water sports & diving", "Luxury resort strip"], bestTime: "Nov \u2013 Apr", distance: "65 km from Colombo" },
  { id: "galle", name: "Galle", x: 42, y: 84, tag: "Coastal", image: "https://images.unsplash.com/photo-1704797390682-76479a29dc9a?w=600&q=80&fm=webp", blurb: "Galle Fort is a living, breathing UNESCO World Heritage Site \u2014 a 16th-century Portuguese and Dutch colonial fortress that remains a vibrant neighbourhood today. Cobblestone streets wind past boutique hotels, artisan shops, art galleries, and some of Sri Lanka\u2019s finest restaurants. The fort\u2019s ramparts offer a sunset walk with panoramic views of the Indian Ocean, while the iconic white Galle Lighthouse stands at the southeastern tip. Inside the fort, the Dutch Reformed Church (1755), the National Maritime Museum, and the old Dutch Hospital shopping precinct tell centuries of colonial history. Galle is easily reached in under 2 hours from Colombo via the Southern Expressway, making it a perfect day trip or the starting point for exploring the south coast.", highlights: ["Fort rampart sunset walk", "Galle Lighthouse", "Dutch Reformed Church (1755)", "Boutique shops & galleries", "National Maritime Museum", "Dutch Hospital dining precinct"], bestTime: "Nov \u2013 Apr", distance: "130 km from Colombo" },
  { id: "mirissa", name: "Mirissa", x: 50, y: 90, tag: "Beach", image: "https://images.unsplash.com/photo-1734279135115-6d8984e08206?w=600&q=80&fm=webp", blurb: "Mirissa is Sri Lanka\u2019s whale watching capital. Between November and April, blue whales \u2014 the largest animals to have ever lived \u2014 pass just a few kilometres offshore, along with pods of spinner dolphins and the occasional sperm whale. On land, Mirissa Beach is a crescent of golden sand backed by palm trees, with a lively surf scene and beachfront restaurants serving fresh seafood. Coconut Tree Hill, the famous palm-topped headland, has become one of Sri Lanka\u2019s most photographed spots. Secret Beach, tucked behind rocks on the eastern end, offers a quieter escape. At dawn, you can still see traditional stilt fishermen balanced on poles in the shallow waters \u2014 a timeless image of the southern coast.", highlights: ["Blue whale watching (Nov\u2013Apr)", "Coconut Tree Hill viewpoint", "Secret Beach cove", "Stilt fishermen at dawn", "Mirissa Beach surf & dining", "Parrot Rock sunset climb"], bestTime: "Nov \u2013 Apr", distance: "155 km from Colombo" },
  { id: "colombo", name: "Colombo", x: 30, y: 64, tag: "Capital", image: "https://images.unsplash.com/photo-1643049996505-1fbe2dfe81af?w=600&q=80&fm=webp", blurb: "Sri Lanka\u2019s commercial capital is a vibrant, fast-evolving city that blends colonial heritage with modern energy. The Gangaramaya Temple complex is a must-visit \u2014 a eclectic Buddhist temple packed with relics, statues, and a museum. Galle Face Green, a 500-metre oceanfront promenade dating to 1859, comes alive at sunset with street food vendors selling isso wade (prawn fritters) and kottu roti. The Dutch Hospital, built in the 1600s, is now a charming dining and shopping precinct. The 356-metre Lotus Tower \u2014 South Asia\u2019s tallest structure \u2014 dominates the skyline and offers panoramic observation deck views. For a taste of old Colombo, the chaotic Pettah Market neighbourhood is an assault on the senses in the best possible way, with spice stalls, textile shops, and mobile phone vendors crammed into narrow lanes.", highlights: ["Gangaramaya Temple complex", "Galle Face Green sunset & food", "Lotus Tower observation deck", "Dutch Hospital shopping precinct", "Pettah Market bazaar", "Independence Square & park"], bestTime: "Year-round", distance: "Airport 35 km" },
];

// ─── Testimonials ───────────────────────────────────────────────

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Kim-Fui G",
    from: "Melbourne, Australia",
    trip: "Honda Grace \u00b7 Airport pickup",
    quote: "Had a fantastic drive. Friendly service and smooth drive. Couldn\u2019t recommend more!",
    avatar: "/reviews/Nathan.JPG",
    rating: 5,
    highlights: ["Airport Transfer", "Colombo"],
  },
  {
    name: "Patricia",
    from: "Poland",
    trip: "Honda Grace \u00b7 10-day round tour",
    quote: "Very professional and trustworthy service. They helped us with transport, hotel suggestions, and planning our route around the island. The whole experience felt very personal and authentic.",
    avatar: "/reviews/Patricia.JPG",
    rating: 5,
    highlights: ["Round Tour", "9 Nights", "Island-wide"],
  },
  {
    name: "Francesco",
    from: "Italy",
    trip: "Toyota Prius \u00b7 Airport pickup & drop",
    quote: "After landing in Sri Lanka, we were happy to see the driver already waiting for us. The pickup was quick and easy, and we reached our hotel comfortably without any hassle. Excellent experience.",
    avatar: "/reviews/Franscesco .JPG",
    rating: 5,
    highlights: ["Airport Transfer", "Colombo"],
  },
  {
    name: "Anaya Sharma",
    from: "India",
    trip: "Toyota Prius \u00b7 4-day tour",
    quote: "We booked a car with driver for our Sri Lanka trip and the experience was amazing from start to finish. The driver was friendly, always on time, and gave us many local recommendations we would never have found ourselves. Highly recommended!",
    avatar: "/reviews/Anaya Sharma.JPG",
    rating: 5,
    highlights: ["3 Nights", "4 Days", "With Driver"],
  },
  {
    name: "Dyaneshwar Khedkar",
    from: "India",
    trip: "Toyota Prius Alpha \u00b7 4-day tour",
    quote: "Aitken Travels made our entire Sri Lanka trip very smooth and completely stress-free. From airport pickup to the full tour across different destinations, everything was perfectly organized. The vehicle was always clean and comfortable, and the driver was very professional and friendly. Communication was quick and reliable throughout the journey, making our whole travel experience truly enjoyable.",
    avatar: "/reviews/Dyaneshwar Khedkar.JPG",
    rating: 5,
    highlights: ["Airport Pickup", "3 Nights", "Multi-destination"],
  },
];

// ─── Travel Stories ─────────────────────────────────────────────
// All images: verified Sri Lanka scenic photos

export const STORIES: Story[] = [
  {
    id: "s1",
    title: "Kandy to Ella: Sri Lanka\u2019s Most Scenic Drive",
    meta: "Hill Country \u00b7 8 min read",
    // Misty tea fields on way to Lipton's Seat, Haputale — verified Sri Lanka
    image: "https://images.unsplash.com/photo-1544451822-38e32b887c08?w=1000&q=80&fm=webp",
  },
  {
    id: "s2",
    title: "A First-Timer\u2019s Guide to the Cultural Triangle",
    meta: "Heritage \u00b7 6 min read",
    // Sigiriya Lion Rock close-up — verified Sri Lanka
    image: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=1000&q=80&fm=webp",
  },
  {
    id: "s3",
    title: "Galle to Mirissa: The Perfect Southern Coast Road Trip",
    meta: "Coastal \u00b7 10 min read",
    // Galle Fort lighthouse with palm trees — verified Sri Lanka
    image: "https://images.unsplash.com/photo-1568725764710-ffed6a9e5c8a?w=1000&q=80&fm=webp",
  },
];

// ─── Offers ─────────────────────────────────────────────────────

export const OFFERS: Offer[] = [
  {
    tag: "Early bird",
    title: "15% off multi-day bookings",
    sub: "Book a 5-day or longer vehicle rental for your Sri Lanka tour and save. Valid for all cars and vans.",
    accent: "terracotta",
  },
  {
    tag: "Airport special",
    title: "Free meet & greet at Bandaranaike Airport",
    sub: "Flight tracking, name board, cold towels, and bottled water \u2014 complimentary with every airport transfer.",
    accent: "gold",
  },
];

// ─── Hero Slides ────────────────────────────────────────────────
// All images: verified via Unsplash API search — confirmed real Sri Lanka photos

export const HERO_SLIDES = [
  {
    // Sigiriya Lion Rock fortress — aerial view above jungle canopy
    img: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=1600&q=80&fm=webp",
    place: "Sigiriya",
    sub: "Lion Rock \u00b7 Cultural Triangle",
  },
  {
    // Galle Fort ramparts at golden hour — UNESCO World Heritage Site
    img: "https://images.unsplash.com/photo-1743614887600-85755ea27cd9?w=1600&q=80&fm=webp",
    place: "Galle",
    sub: "Dutch Fort \u00b7 Southern Coast",
  },
  {
    // Sri Lankan leopard in Yala National Park — wildlife safari
    img: "https://images.unsplash.com/photo-1743014118271-415197f9b0ef?w=1600&q=80&fm=webp",
    place: "Yala",
    sub: "Wildlife Safari \u00b7 National Park",
  },
  {
    // Blue train on Nine Arch Bridge — Ella, Sri Lanka (famous angle)
    img: "https://images.unsplash.com/photo-1566766189268-ecac9118f2b7?w=1600&q=80&fm=webp",
    place: "Ella",
    sub: "Nine Arch Bridge \u00b7 Hill Country",
  },
  {
    // Lush green tea fields near Nuwara Eliya — Sri Lanka tea country
    img: "https://images.unsplash.com/photo-1760532511219-c8b7566f90af?w=1600&q=80&fm=webp",
    place: "Nuwara Eliya",
    sub: "Tea Plantations \u00b7 Hill Country",
  },
  {
    // Tropical beach with palm trees — Sri Lanka east coast
    img: "https://images.unsplash.com/photo-1589534345827-e619f9b2dd2b?w=1600&q=80&fm=webp",
    place: "Trincomalee",
    sub: "Tropical Beach \u00b7 East Coast",
  },
];

// ─── Seasonal Travel Data ───────────────────────────────────────

export interface SeasonDestination {
  regionId: string;
  whyNow: string;
  highlights: string[];
}

export interface Season {
  id: string;
  name: string;
  months: number[];
  monthLabel: string;
  tagline: string;
  description: string;
  weather: {
    condition: string;
    icon: "sun" | "cloud-sun" | "cloud-rain" | "cloud-drizzle";
    tempHigh: number;
    tempLow: number;
    humidity: string;
    rainfall: string;
  };
  heroSlideIndices: number[];
  destinations: SeasonDestination[];
  activities: string[];
  tips: string[];
}

export const SEASONAL_DATA: Season[] = [
  {
    id: "golden-coast",
    name: "Golden Coast Season",
    months: [12, 1, 2, 3],
    monthLabel: "December \u2013 March",
    tagline: "Sun-soaked beaches and ancient wonders await.",
    description: "Sri Lanka\u2019s southwest coast basks in dry, sunny weather \u2014 ideal for golden beaches, whale watching off Mirissa, exploring Galle Fort, and sunrise safaris in Yala.",
    weather: { condition: "Sunny & Dry", icon: "sun", tempHigh: 32, tempLow: 28, humidity: "Low", rainfall: "Minimal" },
    heroSlideIndices: [1, 0, 2, 3],
    destinations: [
      { regionId: "mirissa", whyNow: "Peak whale watching season \u2014 spot blue whales just offshore.", highlights: ["Blue whale tours", "Coconut Tree Hill", "Stilt fishermen"] },
      { regionId: "galle", whyNow: "Dry, golden light makes the fort magical for walking and photography.", highlights: ["Fort rampart walks", "Boutique galleries", "Sunset lighthouse"] },
      { regionId: "bentota", whyNow: "Calm seas and warm sun \u2014 perfect beach resort weather.", highlights: ["Water sports", "River safaris", "Turtle hatchery"] },
      { regionId: "yala", whyNow: "Dry conditions push wildlife to waterholes \u2014 best leopard sighting odds.", highlights: ["Dawn safari drives", "Elephant herds", "Bird watching"] },
      { regionId: "sigiriya", whyNow: "Cool mornings and clear skies for climbing the rock fortress.", highlights: ["Lion Rock climb", "Pidurangala sunrise", "Ancient frescoes"] },
      { regionId: "kandy", whyNow: "Pleasant hill-country weather for temple visits and botanical gardens.", highlights: ["Temple of the Tooth", "Royal Botanical Gardens", "Kandyan dance"] },
    ],
    activities: ["Beach hopping along the south coast", "Whale & dolphin watching", "Yala safari at dawn", "Galle Fort heritage walk", "Sigiriya rock fortress climb", "Surf lessons in Weligama"],
    tips: ["Book whale watching tours at least 2 days ahead \u2014 boats fill fast.", "Start Yala safaris before 6 AM for the best leopard sightings.", "Carry reef-safe sunscreen for beach days.", "This is peak season \u2014 book vehicles and hotels early."],
  },
  {
    id: "festival-hills",
    name: "Festival & Hills Season",
    months: [4, 5],
    monthLabel: "April \u2013 May",
    tagline: "Hill country magic and cultural celebrations.",
    description: "Experience Sri Lanka\u2019s vibrant Sinhala & Tamil New Year, lush tea plantations at their greenest, and the cool embrace of the hill country before the east coast season begins.",
    weather: { condition: "Warm Showers", icon: "cloud-sun", tempHigh: 30, tempLow: 24, humidity: "Moderate", rainfall: "Moderate" },
    heroSlideIndices: [4, 3, 0, 1],
    destinations: [
      { regionId: "nuwaraeliya", whyNow: "Tea fields at peak green \u2014 cool weather perfect for hiking.", highlights: ["Tea factory tours", "Horton Plains trek", "Gregory Lake"] },
      { regionId: "ella", whyNow: "Waterfalls in full flow after early rains \u2014 spectacular views.", highlights: ["Nine Arch Bridge", "Ravana Falls", "Little Adam\u2019s Peak"] },
      { regionId: "kandy", whyNow: "New Year festivities bring the city alive with colour and tradition.", highlights: ["Sinhala New Year celebrations", "Temple ceremonies", "Local markets"] },
      { regionId: "sigiriya", whyNow: "Fewer crowds and dramatic cloud formations over the rock.", highlights: ["Lion Rock at dawn", "Dambulla Cave Temple", "Village cycling"] },
    ],
    activities: ["Sinhala & Tamil New Year celebrations", "Tea plantation walks & tasting", "Scenic train ride (Kandy\u2013Ella)", "Waterfall chasing in hill country", "Temple & heritage trail", "Cooking classes with locals"],
    tips: ["April is New Year \u2014 some shops close for 2\u20133 days, plan accordingly.", "Pack a light rain jacket for afternoon showers.", "The Kandy\u2013Ella train is iconic \u2014 book 1st class seats in advance.", "Shoulder season means better hotel rates and fewer tourists."],
  },
  {
    id: "east-coast",
    name: "East Coast Season",
    months: [6, 7, 8, 9],
    monthLabel: "June \u2013 September",
    tagline: "Untouched east coast beaches and wild safaris.",
    description: "While the southwest gets monsoon rain, Sri Lanka\u2019s east coast shines with crystal-clear waters, world-class surf, and pristine beaches that most tourists never see.",
    weather: { condition: "Dry & Breezy", icon: "sun", tempHigh: 31, tempLow: 27, humidity: "Low", rainfall: "Minimal" },
    heroSlideIndices: [5, 2, 0, 4],
    destinations: [
      { regionId: "trincomalee", whyNow: "Calm turquoise seas \u2014 best snorkelling and diving conditions.", highlights: ["Pigeon Island snorkelling", "Nilaveli Beach", "Whale watching"] },
      { regionId: "wilpattu", whyNow: "Dry season wildlife concentrations around natural lakes.", highlights: ["Leopard tracking", "Sloth bear sightings", "Bird watching"] },
      { regionId: "ella", whyNow: "Clear skies in the hills while the coast stays dry.", highlights: ["Ella Rock hike", "Nine Arch Bridge", "Local caf\u00e9 culture"] },
      { regionId: "nuwaraeliya", whyNow: "Cool hill-country escape from the coastal heat.", highlights: ["Tea estate stays", "Horton Plains", "Pedro Tea Estate"] },
    ],
    activities: ["Snorkelling at Pigeon Island", "Surfing in Arugam Bay", "Wilpattu dawn safari", "East coast beach camping", "Hill country trekking", "Trincomalee whale watching"],
    tips: ["The east coast is less developed \u2014 carry cash as ATMs are sparse.", "Arugam Bay is a 6-hour drive from Colombo \u2014 consider a multi-day trip.", "Book Wilpattu safaris through us for experienced tracker-guides.", "Evenings cool down quickly in the hills \u2014 bring layers."],
  },
  {
    id: "emerald-mist",
    name: "Emerald Mist Season",
    months: [10, 11],
    monthLabel: "October \u2013 November",
    tagline: "Misty mountains and emerald landscapes.",
    description: "Short rains transform Sri Lanka into an emerald paradise. Waterfalls thunder, tea fields glow impossibly green, and you\u2019ll find the best deals of the year with fewer crowds.",
    weather: { condition: "Showers & Mist", icon: "cloud-drizzle", tempHigh: 28, tempLow: 23, humidity: "High", rainfall: "Heavy" },
    heroSlideIndices: [4, 3, 1, 0],
    destinations: [
      { regionId: "nuwaraeliya", whyNow: "Dramatic mist rolling through tea plantations \u2014 magical photography.", highlights: ["Misty tea walks", "Horton Plains clouds", "Cozy hill stays"] },
      { regionId: "ella", whyNow: "Waterfalls at their most powerful \u2014 Ravana and Bambarakanda thunder.", highlights: ["Waterfall viewing", "Train through mist", "Ella Rock in clouds"] },
      { regionId: "kandy", whyNow: "Temple visits in cool weather \u2014 serene atmosphere with fewer tourists.", highlights: ["Temple of the Tooth", "Botanical Gardens", "Udawattakele forest"] },
      { regionId: "colombo", whyNow: "The capital\u2019s food scene, museums, and shopping are rain-proof.", highlights: ["Food tours", "Gangaramaya Temple", "Galle Face sunset"] },
    ],
    activities: ["Waterfall trail in the hills", "Tea plantation morning walks", "Temple & meditation retreats", "Colombo street food tours", "Photography in the mist", "Ayurvedic spa experiences"],
    tips: ["Rain is mostly afternoon bursts \u2014 mornings are often clear and beautiful.", "This is the best time for budget travel \u2014 rates drop 20\u201340%.", "Waterproof bags are essential for electronics.", "Leeches are active on forest trails \u2014 wear closed shoes and carry salt."],
  },
];

export function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1;
  return SEASONAL_DATA.find((s) => s.months.includes(month)) || SEASONAL_DATA[0];
}
