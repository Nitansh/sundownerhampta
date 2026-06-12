export interface Room {
  id: string;
  name: string;
  description: string;
  image: string;
  images: string[];
  size: string;
  occupancy: string;
  amenities: string[];
  price: number;
  available: boolean;
}

export interface Package {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  duration: string;
  amenities: string[];
  includes: string[];
  type: string;
  image: string;
}

export interface Experience {
  id: string;
  category: 'trekking' | 'adventure' | 'farm' | 'nature';
  title: string;
  description: string;
  image: string;
  items: string[];
}

export interface Attraction {
  name: string;
  distance: string;
  time: string;
  season: string;
  description: string;
  activities: string[];
  image: string;
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  source: 'google' | 'testimonial';
  comment: string;
  tripType: string;
}

export interface GalleryItem {
  id: string;
  category: 'rooms' | 'views' | 'trekking' | 'activities' | 'farm' | 'bonfire' | 'experiences';
  image: string;
  title: string;
}

export const ROOMS: Room[] = [
  {
    id: 'attic-suite',
    name: 'Himalayan Attic Suite',
    description: 'Cozy, wood-paneled attic room featuring triangular skylights, a private reading nook, and a plush king bed directly under the stars.',
    image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
    ],
    size: '450 sq ft',
    occupancy: '2 Adults',
    amenities: ['Mountain View', 'WiFi', 'Hot Water', 'Attached Washroom', 'Skylight', 'Heater', 'Breakfast Included'],
    price: 6500,
    available: true
  },
  {
    id: 'valley-balcony',
    name: 'Valley View Balcony Room',
    description: 'Bespoke mountain suite boasting a spacious private glass balcony framing unobstructed panoramic views of the Hampta Valley peaks.',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'
    ],
    size: '520 sq ft',
    occupancy: '2-3 Adults',
    amenities: ['Mountain View', 'WiFi', 'Hot Water', 'Attached Washroom', 'Balcony', 'Heater', 'Parking', 'Breakfast Included'],
    price: 7500,
    available: true
  },
  {
    id: 'wooden-cabin',
    name: 'Luxury Chalet Wooden Cabin',
    description: 'Fully independent rustic-luxury cedar-wood cabin with a stone fireplace, private veranda, and handcrafted mountain-view furniture.',
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80'
    ],
    size: '680 sq ft',
    occupancy: '4 Adults',
    amenities: ['Mountain View', 'WiFi', 'Hot Water', 'Attached Washroom', 'Balcony', 'Fireplace', 'Heater', 'Kitchenette', 'Parking', 'Breakfast Included'],
    price: 11000,
    available: true
  }
];

export const PACKAGES: Package[] = [
  {
    id: 'pkg-adventure',
    name: 'Hampta Adventure Odyssey',
    tagline: 'Stay. Trek. Climb. Repeat.',
    description: 'Perfect for thrill-seekers wanting to conquer trails and touch the sky. A structured outdoor package blending luxury stays with rugged trekking experiences.',
    price: 24999,
    duration: '3 Nights / 4 Days',
    type: 'adventure',
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80',
    amenities: ['Chalet Cabin', 'All Meals Included', 'Private Hiking Guide', 'Bonfire Nights'],
    includes: [
      '3-night luxury wooden cabin accommodation',
      'Guided Day Hike to Sethan Dome and Hampta Pass entry points',
      'Adventure sports gear hire (Mountain biking & Climbing ropes)',
      'Traditional Himachali gourmet dinners under the stars with private bonfire'
    ]
  },
  {
    id: 'pkg-family',
    name: 'Himalayan Family Heritage',
    tagline: 'Bond in the lap of nature.',
    description: 'An immersive experience for families of all ages. Enjoy the simplicity of farm life, organic meals, local history walks, and stargazing evenings.',
    price: 28500,
    duration: '3 Nights / 4 Days',
    type: 'family',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    amenities: ['Valley View Balcony Room', 'Farm Activities', 'Local Sightseeing', 'Kid-friendly meals'],
    includes: [
      '3-night Valley View room stay (extra bed included)',
      'Guided apple orchard tour and organic fruit-picking activities',
      'Traditional cooking workshop (Learn to make Siddu and local chutneys)',
      'Manali & Jogini Falls half-day guided tour with private SUV transport'
    ]
  },
  {
    id: 'pkg-nomad',
    name: 'High-Altitude Digital Nomad',
    tagline: 'Work where the clouds meet the mountains.',
    description: 'Combine professional focus with wilderness walks. Features dedicated high-speed Starlink internet, power backup, and quiet workspace access at deep discounts.',
    price: 42000,
    duration: '14 Nights / 15 Days',
    type: 'nomad',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    amenities: ['Himalayan Attic Suite', 'High-Speed Starlink WiFi', 'Dedicated Desk', 'Power Backup'],
    includes: [
      '14-night Attic Suite stay with sweeping mountain views',
      'Unlimited high-speed internet and access to common lounge workstations',
      'Complimentary unlimited organic tea and French-press local coffee',
      'Weekly laundry service and 15% discount on dining menu items'
    ]
  },
  {
    id: 'pkg-honeymoon',
    name: 'Sunset & Snow Romance',
    tagline: 'A love story above the clouds.',
    description: 'An exclusive, deeply personalized retreat for couples. Features floral arrangements, private candlelit valley view dining, and romantic guided nature walks.',
    price: 19999,
    duration: '2 Nights / 3 Days',
    type: 'honeymoon',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    amenities: ['Valley View Balcony Room', 'Decorated Suite', 'Candlelit Dinner', 'Couple Guided Walks'],
    includes: [
      '2-night Valley View Room with customized floral and aromatic oil layouts',
      'Private 4-course Himachali BBQ and candlelit dining on the valley deck',
      'Champagne / local organic fruit wine on arrival',
      'Scenic photography tour guided by a professional local mountaineer'
    ]
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'trek-exp',
    category: 'trekking',
    title: 'High-Altitude Alpine Treks',
    description: 'Hampta Valley is the ultimate basecamp. Walk through deep pine forests, alpine meadows, and cross the majestic Hampta Pass at 14,100 ft.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    items: [
      'Hampta Pass Expedition: A dramatic cross-over trek connecting Manali to Lahaul valley.',
      'Sethan Dome Hike: A day trek peaking at 3,600m with 360-degree views of Dhauladhar ranges.',
      'Guided Meadow Walks: Gentle strolls through alpine grasslands alongside local shepherds.',
      'Sunrise Trek to Chikka: Discover glacial streams, waterfalls, and alpine wild flora.'
    ]
  },
  {
    id: 'adv-exp',
    category: 'adventure',
    title: 'Thrills in the Wilderness',
    description: 'For those who find peace in adrenaline, our rugged valley offers rock climbing, off-roading, and snow sports during the magical winter seasons.',
    image: 'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=800&q=80',
    items: [
      'Wild Alpine Camping: Pitch luxury tents on mountain ridges with zero light pollution.',
      'Natural Rock Climbing & Rappelling: Climb rugged granite faces in Sethan under expert guidance.',
      'Mountain Biking Trails: Navigate down thrilling dirt tracks in Hampta valley pine ridges.',
      'Winter Snowboarding & Skiing: Sethan is India’s premier destination for backcountry snow sports.'
    ]
  },
  {
    id: 'farm-exp',
    category: 'farm',
    title: 'Organic Himachali Farm Life',
    description: 'Step into a slower rhythm. Our homestay is surrounded by organic apple orchards, vegetable patches, and warm local traditions.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    items: [
      'Apple Orchard Tours: Pluck fresh Himachali apples, plums, and peaches (July to October).',
      'Organic Farming & Harvesting: Assist in weeding, seed sowing, and organic potato harvesting.',
      'Local Village Walk: Explore traditional wooden houses and converse with elders of Hampta.',
      'Traditional Himachali Looming: Watch and learn how local artisans weave warm woolen shawls.'
    ]
  },
  {
    id: 'nature-exp',
    category: 'nature',
    title: 'Celestial Nights & Nature Walks',
    description: 'Unwind and reconnect. Listen to the crackle of wood fire under the Milky Way, or look out for colorful Himalayan birds in the mornings.',
    image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=800&q=80',
    items: [
      'Pristine Stargazing: Zero smog and absolute altitude expose incredible constellations.',
      'Himalayan Bird Watching: Spot Monals, Golden Eagles, and colorful sunbirds around the trees.',
      'Landscape Photography: Capture golden hour sunrays reflecting off majestic snow caps.',
      'Curated Bonfire Nights: Sit around cozy firewood circles, listening to local folk tales and music.'
    ]
  }
];

export const ATTRACTIONS: Attraction[] = [
  {
    name: 'Hampta Pass Peak',
    distance: '15 km (trekking route start)',
    time: '45 mins (to base camp)',
    season: 'June to October',
    description: 'The high mountain pass connecting Kullu Valley with Spiti Valley, featuring dramatic shifts from lush green fields to stark cold deserts.',
    activities: ['Trekking', 'Alpine Camping', 'Glacier crossing', 'Landscape Photography'],
    image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Sethan Village',
    distance: '3 km',
    time: '12 mins drive',
    season: 'Year-round (Best snow in Jan-Mar)',
    description: 'A charming, Buddhist village situated above Manali. Famous for its quiet environment, snow igloos, and boulder climbing blocks.',
    activities: ['Igloo Stays', 'Bouldering', 'Backcountry Skiing', 'Buddhist Monastery Visit'],
    image: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Jogini Waterfalls',
    distance: '12 km',
    time: '35 mins drive + 30 mins hike',
    season: 'March to November',
    description: 'A gorgeous cascading waterfall hiking route that starts from Vashisht village, walking through dense pine forests and apple orchards.',
    activities: ['Forest Hiking', 'Religious temple shrine visit', 'Cold spring dip'],
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Atal Tunnel & Sissu',
    distance: '38 km',
    time: '1.5 hours drive',
    season: 'Year-round',
    description: 'The world\'s longest highway tunnel above 10,000 feet, opening into the gorgeous, waterfall-lined landscape of Sissu in Lahaul Valley.',
    activities: ['Sissu waterfall visit', 'Lahaul valley tour', 'Boating in lake', 'Helicopter joyrides'],
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Arjun Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    date: 'May 2026',
    source: 'google',
    comment: 'Sundowner Hampta is an absolute dream! The Himalayan Attic Suite offered stunning morning views of snow-capped peaks. The Himachali hospitality and fresh Siddu made us feel at home. Highly recommended!',
    tripType: 'Couple Retreat'
  },
  {
    id: 'rev-2',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    date: 'April 2026',
    source: 'google',
    comment: 'I spent two weeks here working remotely. High-speed Starlink WiFi was rock solid even in heavy snow, and the quiet mountain surroundings boosted my productivity. The hiking guides are fantastic.',
    tripType: 'Digital Nomad Stay'
  },
  {
    id: 'rev-3',
    name: 'Rohan & Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    date: 'June 2026',
    source: 'testimonial',
    comment: 'We booked the Honeymoon Package and it was flawless. The candlelit dinner on the open deck facing the valley lights was magical. Stargazing at night with wood fire and local wines was unforgettable.',
    tripType: 'Honeymoon Package'
  },
  {
    id: 'rev-4',
    name: 'The Verma Family',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    date: 'June 2026',
    source: 'google',
    comment: 'Perfect for children! Our kids loved plucking fresh plums from the farm orchards and walking around Sethan village. The rooms are warm and the local staff cooked customized, non-spicy meals for our toddler.',
    tripType: 'Family Vacation'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 'gal-1', category: 'rooms', image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80', title: 'Himalayan Attic Suite Interior' },
  { id: 'gal-2', category: 'rooms', image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', title: 'Valley View Suite Balcony' },
  { id: 'gal-3', category: 'views', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', title: 'Breathtaking Sunrise over Dhauladhar' },
  { id: 'gal-4', category: 'views', image: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&w=800&q=80', title: 'Snowy Peaks Backdrop' },
  { id: 'gal-5', category: 'trekking', image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80', title: 'Trekkers on the trail to Hampta Pass' },
  { id: 'gal-6', category: 'trekking', image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80', title: 'Glacial stream crossing' },
  { id: 'gal-7', category: 'activities', image: 'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=800&q=80', title: 'Mountain Biking down valley slopes' },
  { id: 'gal-8', category: 'activities', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80', title: 'Wild Camping under starry skies' },
  { id: 'gal-9', category: 'farm', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80', title: 'Organic Apple Orchard Harvesting' },
  { id: 'gal-10', category: 'farm', image: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80', title: 'Local Village Heritage Walk' },
  { id: 'gal-11', category: 'bonfire', image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=800&q=80', title: 'Starry Sky over Hampta Valley' },
  { id: 'gal-12', category: 'bonfire', image: 'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=800&q=80', title: 'Cozy Wood Bonfire Gatherings' }
];

export const DINING_MENU = {
  description: 'At Sundowner Hampta, dining is a celebration of Himachali heritage and sustainable living. Enjoy fresh organic ingredients harvested directly from our backyard, combined with slow-cooked traditional mountain recipes.',
  features: [
    { title: 'Himachali Siddu', desc: 'Fluffy, steamed wheat buns stuffed with spiced poppy seeds or walnuts, served warm with generous amounts of organic cow ghee.' },
    { title: 'Organic Farm-to-Table', desc: 'Fresh garden peas, leafy spinach, herbs, and high-altitude mountain potatoes plucked right before cooking.' },
    { title: 'BBQ and Tandoori Nights', desc: 'Smokey, seasoned meats and local paneer grilled over a dynamic wood bonfire, perfect for chilly Himalayan nights.' },
    { title: 'Traditional Madra & Chana', desc: 'Traditional festive chickpea yogurt dishes seasoned with cardamoms, cloves, and indigenous spices.' }
  ],
  gallery: [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'
  ]
};
